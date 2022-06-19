import { UserService } from '@app/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { TenantService } from '../tenant/tenant.service';
import { AuthorizationNode } from './dto/authorization-node';
import { AuthorizationsArgs } from './dto/authorizations.args';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import {
  Authorization,
  AuthorizationAction,
  AuthorizationResource,
  UserEmail,
} from '@app/data-base/entities/boomemory';
import { AppID } from 'utils/app/assets';
import { ConfigService } from '@app/config';
import { PassportService } from '@app/passport';
import { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface';
import { Client as SesClient } from 'tencentcloud-sdk-nodejs/tencentcloud/services/ses/v20201002/ses_client';
import { VerifyInput } from './dto/verify.input';
import dayjs = require('dayjs');
import { SendCaptchaArgs } from './dto/send-captcha.args';

@Injectable()
export class AuthService {
  private sesClient: SesClient;

  constructor(
    @InjectRepository(Authorization, AppID.Boomemory)
    private readonly authorizationRepository: Repository<Authorization>,
    @InjectRepository(AuthorizationResource, AppID.Boomemory)
    private readonly authorizationResourceRepository: Repository<AuthorizationResource>,
    @InjectRepository(AuthorizationAction, AppID.Boomemory)
    private readonly authorizationActionRepository: Repository<AuthorizationAction>,
    @InjectRepository(UserEmail, AppID.Boomemory)
    private readonly userEmailRepository: Repository<UserEmail>,
    private readonly userService: UserService,
    private readonly passportService: PassportService,
    private readonly configService: ConfigService,
    private readonly tenantService: TenantService,
  ) {
    const clientConfig: ClientConfig = {
      credential: {
        secretId: this.configService.getTencentCloudSecretId(),
        secretKey: this.configService.getTencentCloudSecretKey(),
      },
      region: 'ap-hongkong',
    };

    this.sesClient = new SesClient(clientConfig);
  }

  /**
   * 登录
   */
  async login(login: LoginInput): Promise<string> {
    // 匹配用户信息
    const user = await this.userService.getValidatedUser(login);

    // error: 用户信息不存在
    if (!user) throw new UnauthorizedException();

    // 加密生成token
    return this.passportService.sign(user.id);
  }

  /**
   * 注册
   */
  async register(registerInput: RegisterInput): Promise<string> {
    // 创建用户
    const user = await this.userService.create(registerInput);

    // 加密生成token
    return this.passportService.sign(user.id);
  }

  /**
   * 分页查询权限
   */
  getAuthorizations(query?: QueryParams) {
    return paginateQuery(this.authorizationRepository, query);
  }

  /**
   * 查询权限树
   */
  async getAuthorizationTree() {
    // 查询租户列表
    const tenants = (await this.tenantService.getTenants()).items;

    // 权限表查询
    const authorizations = await this.authorizationRepository.find({
      relations: ['tenant', 'resource', 'action'],
      where: {
        isDeleted: false,
      },
    });

    // 生成树
    return authorizations.reduce<AuthorizationNode[]>(
      (previous, authorization) => {
        const actionNode = {
          key: authorization.id,
          title: authorization.action.name,
          code: authorization.action.code,
        };

        // 查询租户
        const tenantNode = previous.find(
          (tenant) => tenant.code === authorization.tenant.code,
        );

        // 租户不存在，不生成权限
        if (!tenantNode) return previous;

        // 查询资源
        const resourceNode = tenantNode.children.find(
          (resource) => resource.code === authorization.resource.code,
        );

        if (!resourceNode) {
          // 不存在：生成资源节点 and 添加操作节点
          tenantNode.children.push({
            // 生成唯一key
            key: `${authorization.tenant.code}:${authorization.resource.code}`,
            title: authorization.resource.name,
            code: authorization.resource.code,
            children: [actionNode],
          });
        } else {
          // 存在：添加操作节点
          resourceNode.children.push(actionNode);
        }

        return previous;
      },

      // 初始化树
      tenants.map((tenant) => ({
        key: tenant.code,
        title: tenant.name,
        code: tenant.code,
        children: [],
      })),
    );
  }

  /**
   * 查询权限资源
   */
  getAuthorizationResources() {
    return this.authorizationResourceRepository.find();
  }

  /**
   * 查询权限操作
   */
  getAuthorizationActions() {
    return this.authorizationActionRepository.find();
  }

  /**
   * 分配权限
   */
  async setAuthorizations(args: AuthorizationsArgs) {
    const authorizeds = await this.authorizationRepository.find({
      where: {
        tenantCode: args.tenantCode,
      },
    });

    // 设置为删除
    authorizeds.forEach((authorized) => (authorized.isDeleted = true));

    args.authorizations.forEach((resource) => {
      return resource.actionCodes.forEach((actionCode) => {
        const authorized = authorizeds.find(
          (authorized) =>
            authorized.actionCode === actionCode &&
            authorized.tenantCode === args.tenantCode &&
            authorized.resourceCode === resource.resourceCode,
        );

        // 已存在，更新
        if (authorized) {
          authorized.isDeleted = false;
          return;
        }

        // 未存在，创建
        authorizeds.push(
          this.authorizationRepository.create({
            tenantCode: args.tenantCode,
            resourceCode: resource.resourceCode,
            actionCode,
          }),
        );
      });
    });

    return !!(await this.authorizationRepository.save(authorizeds)).length;
  }

  /**
   * 发送验证码
   */
  async sendCaptcha(sendCaptchaArgs: SendCaptchaArgs): Promise<Date> {
    // 获取userEmail对象
    // 不存在则创建，存在则获取
    const userEmail = await this.userService.getOrGenerateUserEmail(
      sendCaptchaArgs.emailAddress,
    );

    // 每1分钟仅可发送一次
    if (
      userEmail.sentAt &&
      dayjs().subtract(1, 'minute').isBefore(userEmail.sentAt)
    ) {
      throw new Error('验证码发送太频繁，请稍后再试');
    }

    // 执行发送邮件
    const params = {
      FromEmailAddress: 'no-replay@account.fantufantu.com',
      Destination: [sendCaptchaArgs.emailAddress],
      Subject: '通过邮件确认身份',
      Template: {
        TemplateID: 28985,
        TemplateData: JSON.stringify({
          captcha: userEmail.captcha,
        }),
      },
    };

    const currentSentAt = dayjs().toDate();
    await this.sesClient.SendEmail(params);

    // 发送失败会直接抛出异常
    // 执行到这 = 发送成功
    // 更新上次发送时间
    await this.userEmailRepository.update(sendCaptchaArgs.emailAddress, {
      sentAt: dayjs().toDate(),
    });

    return currentSentAt;
  }

  /**
   * 验证
   */
  async verify(verifyInput: VerifyInput, emailAddress: string) {
    return !!(
      await this.userEmailRepository
        .createQueryBuilder()
        .update()
        .set({
          isVerified: true,
        })
        .where('address = :emailAddress', {
          emailAddress,
        })
        .andWhere('captcha = :captcha', {
          captcha: verifyInput.captcha,
        })
        .execute()
    ).affected;
  }
}
