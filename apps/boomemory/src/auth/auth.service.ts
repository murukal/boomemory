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
   * ??????
   */
  async login(login: LoginInput): Promise<string> {
    // ??????????????????
    const user = await this.userService.getValidatedUser(login);

    // error: ?????????????????????
    if (!user) throw new UnauthorizedException();

    // ????????????token
    return this.passportService.sign(user.id);
  }

  /**
   * ??????
   */
  async register(registerInput: RegisterInput): Promise<string> {
    // ?????????????????????
    const isVerified = await this.userService.verifyUserEmail({
      emailAddress: registerInput.emailAddress,
      captcha: registerInput.captcha,
    });

    if (!isVerified) {
      throw new Error('???????????????????????????????????????');
    }

    // ????????????
    const user = await this.userService.create(registerInput);

    // ????????????token
    return this.passportService.sign(user.id);
  }

  /**
   * ??????????????????
   */
  getAuthorizations(query?: QueryParams) {
    return paginateQuery(this.authorizationRepository, query);
  }

  /**
   * ???????????????
   */
  async getAuthorizationTree() {
    // ??????????????????
    const tenants = (await this.tenantService.getTenants()).items;

    // ???????????????
    const authorizations = await this.authorizationRepository.find({
      relations: ['tenant', 'resource', 'action'],
      where: {
        isDeleted: false,
      },
    });

    // ?????????
    return authorizations.reduce<AuthorizationNode[]>(
      (previous, authorization) => {
        const actionNode = {
          key: authorization.id,
          title: authorization.action.name,
          code: authorization.action.code,
        };

        // ????????????
        const tenantNode = previous.find(
          (tenant) => tenant.code === authorization.tenant.code,
        );

        // ?????????????????????????????????
        if (!tenantNode) return previous;

        // ????????????
        const resourceNode = tenantNode.children.find(
          (resource) => resource.code === authorization.resource.code,
        );

        if (!resourceNode) {
          // ?????????????????????????????? and ??????????????????
          tenantNode.children.push({
            // ????????????key
            key: `${authorization.tenant.code}:${authorization.resource.code}`,
            title: authorization.resource.name,
            code: authorization.resource.code,
            children: [actionNode],
          });
        } else {
          // ???????????????????????????
          resourceNode.children.push(actionNode);
        }

        return previous;
      },

      // ????????????
      tenants.map((tenant) => ({
        key: tenant.code,
        title: tenant.name,
        code: tenant.code,
        children: [],
      })),
    );
  }

  /**
   * ??????????????????
   */
  getAuthorizationResources() {
    return this.authorizationResourceRepository.find();
  }

  /**
   * ??????????????????
   */
  getAuthorizationActions() {
    return this.authorizationActionRepository.find();
  }

  /**
   * ????????????
   */
  async setAuthorizations(args: AuthorizationsArgs) {
    const authorizeds = await this.authorizationRepository.find({
      where: {
        tenantCode: args.tenantCode,
      },
    });

    // ???????????????
    authorizeds.forEach((authorized) => (authorized.isDeleted = true));

    args.authorizations.forEach((resource) => {
      return resource.actionCodes.forEach((actionCode) => {
        const authorized = authorizeds.find(
          (authorized) =>
            authorized.actionCode === actionCode &&
            authorized.tenantCode === args.tenantCode &&
            authorized.resourceCode === resource.resourceCode,
        );

        // ??????????????????
        if (authorized) {
          authorized.isDeleted = false;
          return;
        }

        // ??????????????????
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
   * ???????????????
   */
  async sendCaptcha(sendCaptchaArgs: SendCaptchaArgs): Promise<Date> {
    // ??????userEmail??????
    // ????????????????????????????????????
    const userEmail = await this.userService.getOrGenerateUserEmail(
      sendCaptchaArgs.emailAddress,
    );

    // ???1????????????????????????
    if (
      userEmail.sentAt &&
      dayjs().subtract(1, 'minute').isBefore(userEmail.sentAt)
    ) {
      throw new Error('??????????????????????????????????????????');
    }

    // ??????????????????
    const params = {
      FromEmailAddress: 'no-replay@account.fantufantu.com',
      Destination: [sendCaptchaArgs.emailAddress],
      Subject: '????????????????????????',
      Template: {
        TemplateID: 28985,
        TemplateData: JSON.stringify({
          captcha: userEmail.captcha,
        }),
      },
    };

    const currentSentAt = dayjs().toDate();
    await this.sesClient.SendEmail(params);

    // ?????????????????????????????????
    // ???????????? = ????????????
    // ????????????????????????
    await this.userEmailRepository.update(sendCaptchaArgs.emailAddress, {
      sentAt: dayjs().toDate(),
    });

    return currentSentAt;
  }
}
