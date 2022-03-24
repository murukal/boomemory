import {
  Authorization,
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
    // 权限表查询
    const authorizations = await this.authorizationRepository.find({
      relations: ['tenant'],
    });

    // 生成树
    return authorizations.reduce<AuthorizationNode[]>(
      (previous, authorization) => {
        const operationNode = {
          key: authorization.id,
          title: authorization.operation,
        };

        // 查询租户 是否已经收集
        const tenantNode = previous.find(
          (tenant) => tenant.key === authorization.tenant.code,
        );

        if (!tenantNode) {
          return previous.concat({
            key: authorization.tenant.code,
            title: authorization.tenant.name,
            checkable: false,
            children: [
              {
                key: authorization.resource,
                title: authorization.resource,
                checkable: false,
                children: [operationNode],
              },
            ],
          });
        }

        // 查询资源 是否已经收集
        const resourceNode = tenantNode.children.find(
          (resource) => resource.key === authorization.resource,
        );

        if (!resourceNode) {
          tenantNode.children.push({
            key: authorization.resource,
            title: authorization.resource,
            checkable: false,
            children: [operationNode],
          });

          return previous;
        }

        // 添加操作节点
        resourceNode.children.push(operationNode);

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
}
