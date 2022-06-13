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
} from '@app/data-base/entities/boomemory';
import { AppID } from 'utils/app/assets';
import { ConfigService } from '@app/config';
import { PassportService } from '@app/passport';
import { AuthenticatedProfile } from './dto/authenticated-profile';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Authorization, AppID.Boomemory)
    private readonly authorizationRepository: Repository<Authorization>,
    @InjectRepository(AuthorizationResource, AppID.Boomemory)
    private readonly authorizationResourceRepository: Repository<AuthorizationResource>,
    @InjectRepository(AuthorizationAction, AppID.Boomemory)
    private readonly authorizationActionRepository: Repository<AuthorizationAction>,
    private readonly userService: UserService,
    private readonly passportService: PassportService,
    private readonly configService: ConfigService,
    private readonly tenantService: TenantService,
  ) {}

  /**
   * 登录
   */
  async login(login: LoginInput): Promise<AuthenticatedProfile> {
    // 匹配用户信息
    const user = await this.userService.getValidatedUser(login);

    // error: 用户信息不存在
    if (!user) throw new UnauthorizedException();

    // 加密生成token
    return {
      token: user.isVerified ? this.passportService.sign(user.id) : null,
      isVerified: user.isVerified,
    };
  }

  /**
   * 注册
   */
  async register(register: RegisterInput): Promise<AuthenticatedProfile> {
    // 注册密码解密
    register.password = this.userService.decryptByRsaPrivateKey(
      register.password,
      this.configService.getRsaPrivateKey(),
    );

    // 创建用户
    const user = await this.userService.create(register);

    // 加密生成token
    return {
      token: user.isVerified ? this.passportService.sign(user.id) : null,
      isVerified: user.isVerified,
    };
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
}
