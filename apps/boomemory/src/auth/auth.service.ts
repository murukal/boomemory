import { UserService } from '@app/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { constants, privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { TenantService } from '../tenant/tenant.service';
import { AuthorizationNode } from './dto/authorization-node';
import { AuthorizationsArgs } from './dto/authorizations.args';
import { FilterUserInput } from './dto/filter-user.input';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { compareSync } from 'bcrypt';
import {
  Authorization,
  AuthorizationAction,
  AuthorizationResource,
} from '@app/data-base/entities/boomemory';
import { Essay } from '@app/data-base/entities/boomart';
import { AppID } from 'utils/app/assets';
import { ConfigService } from '@app/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Authorization, AppID.Boomemory)
    private readonly authorizationRepository: Repository<Authorization>,
    @InjectRepository(Essay, AppID.Boomart)
    private readonly essayRepository: Repository<Essay>,
    @InjectRepository(AuthorizationResource, AppID.Boomemory)
    private readonly authorizationResourceRepository: Repository<AuthorizationResource>,
    @InjectRepository(AuthorizationAction, AppID.Boomemory)
    private readonly authorizationActionRepository: Repository<AuthorizationAction>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tenantService: TenantService,
  ) {}

  /**
   * 验证用户名/密码
   */
  async getValidatedUser(payload: LoginInput) {
    // 根据关键字获取用户
    const user = await this.userService.getUser(payload.keyword, {
      id: true,
      password: true,
    });

    if (!user) throw new UnauthorizedException('用户名或者密码错误！');

    // 校验密码
    const isPasswordValidate = compareSync(
      this.decryptByRsaPrivateKey(
        payload.password,
        this.configService.getRsaPrivateKey(),
      ),
      user.password,
    );

    if (!isPasswordValidate)
      throw new UnauthorizedException('用户名或者密码错误！');

    return user;
  }

  /**
   * 对登录信息进行认证
   */
  async authorize(payload: LoginInput) {
    // 认证
    const { id } = await this.getValidatedUser(payload);
    // 用户信息
    return await this.userService.getUser(id);
  }

  /**
   * jwt加签
   */
  sign(id: number) {
    return this.jwtService.sign({
      id,
    });
  }

  /**
   * 登录
   */
  async login(login: LoginInput) {
    // 匹配用户信息
    const user = await this.getValidatedUser(login);
    // error: 用户信息不存在
    if (!user) throw new UnauthorizedException();
    // 加密
    return this.sign(user.id);
  }

  /**
   * 注册
   */
  async register(register: RegisterInput) {
    // 注册密码解密
    register.password = this.decryptByRsaPrivateKey(
      register.password,
      this.configService.getRsaPrivateKey(),
    );
    // 创建用户
    const user = await this.userService.create(register);
    // 加密
    return this.sign(user.id);
  }

  /**
   * 利用RSA公钥私钥解密前端传输过来的密文密码
   */
  decryptByRsaPrivateKey(encoding: string, privateKey: string): string {
    try {
      return privateDecrypt(
        { key: privateKey, padding: constants.RSA_PKCS1_PADDING },
        Buffer.from(encoding, 'base64'),
      ).toString();
    } catch (e) {
      return encoding;
    }
  }

  /**
   * 分页查询用户
   */
  getUsers(query?: QueryParams<FilterUserInput>) {
    return this.userService.getUsers(query);
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
   * 获取作品个数
   */
  getCreationCount(createdById: number) {
    return this.essayRepository
      .createQueryBuilder()
      .where('createdById = :createdById', { createdById })
      .getCount();
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
}
