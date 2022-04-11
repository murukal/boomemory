import {
  Authorization,
  AuthorizationAction,
  AuthorizationResource,
  CONNECTION_BOOMART,
  CONNECTION_BOOMEMORY,
  Essay,
} from '@app/data-base/entities';
import { UserService } from '@app/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { constants, privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { AuthorizationNode } from './dto/authorization-node';
import { AuthorizationsArgs } from './dto/authorizations.args';
import { FilterUserInput } from './dto/filter-user.input';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Authorization, CONNECTION_BOOMEMORY)
    private readonly authorizationRepository: Repository<Authorization>,
    @InjectRepository(Essay, CONNECTION_BOOMART)
    private readonly essayRepository: Repository<Essay>,
    @InjectRepository(AuthorizationResource, CONNECTION_BOOMEMORY)
    private readonly authorizationResourceRepository: Repository<AuthorizationResource>,
    @InjectRepository(AuthorizationAction, CONNECTION_BOOMEMORY)
    private readonly authorizationActionRepository: Repository<AuthorizationAction>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getValidatedUser(payload: LoginInput) {
    return this.userService.getUser(payload.keyword);
  }

  sign(id: number) {
    return this.jwtService.sign({
      id,
    });
  }

  async login(login: LoginInput) {
    // 匹配用户信息
    const user = await this.getValidatedUser(login);
    // 用户信息不存在，抛出一场
    if (!user) throw new UnauthorizedException();
    // 加密
    return this.sign(user.id);
  }

  async register(register: RegisterInput) {
    // 注册密码解密
    register.password = this.decryptByRsaPrivateKey(
      register.password,
      this.configService.get<string>('rsa.privateKey'),
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
   * 查询多个用户
   */
  getUsers(query?: QueryParams<FilterUserInput>) {
    return this.userService.getUsers(query);
  }

  /**
   * 查询多个权限
   */
  getAuthorizations(query?: QueryParams) {
    return paginateQuery(this.authorizationRepository, query);
  }

  /**
   * 查询权限树
   */
  async getAuthorizationTree() {
    const getResourceKey = (tenantCode: string, resourceCode: string) =>
      `${tenantCode}:${resourceCode}`;

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
          key: authorization.id.toString(),
          title: authorization.action.name,
          code: authorization.action.code,
        };

        // 查询租户 是否已经收集
        const tenantNode = previous.find(
          (tenant) => tenant.key === authorization.tenant.code,
        );

        if (!tenantNode) {
          return previous.concat([
            {
              key: authorization.tenant.code,
              title: authorization.tenant.name,
              checkable: false,
              code: authorization.tenant.code,
              children: [
                {
                  key: `${authorization.tenant.code}:${authorization.resource.code}`,
                  title: authorization.resource.name,
                  checkable: false,
                  children: [actionNode],
                  code: authorization.resource.code,
                },
              ],
            },
          ]);
        }

        // 查询资源 是否已经收集
        const resourceNode = tenantNode.children.find(
          (resource) =>
            resource.key ===
            getResourceKey(tenantNode.key, authorization.resource.code),
        );

        if (!resourceNode) {
          tenantNode.children.push({
            key: getResourceKey(tenantNode.key, authorization.resource.code),
            title: authorization.resource.name,
            code: authorization.resource.code,
            checkable: false,
            children: [actionNode],
          });

          return previous;
        }

        // 添加操作节点
        resourceNode.children.push(actionNode);

        return previous;
      },
      [],
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

    const authorizations = args.authorizations.flatMap((resource) => {
      return resource.actionCodes.map((actionCode) => {
        const authorized = authorizeds.find(
          (authorized) =>
            authorized.actionCode === actionCode &&
            authorized.tenantCode === args.tenantCode &&
            authorized.resourceCode === resource.resourceCode,
        );

        // 已存在，更新
        if (authorized) {
          authorized.isDeleted = false;
          return authorized;
        }

        // 未存在，创建
        return this.authorizationRepository.create({
          tenantCode: args.tenantCode,
          resourceCode: resource.resourceCode,
          actionCode,
        });
      });
    });

    return !!(await this.authorizationRepository.save(authorizations)).length;
  }
}
