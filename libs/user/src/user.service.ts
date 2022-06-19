import { User, UserEmail } from '@app/data-base/entities/boomemory';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterUserInput } from '@app/user/dto/filter-user.input';
import { RegisterInput } from 'apps/boomemory/src/auth/dto/register.input';
import { FindOneOptions, In, Not, Repository } from 'typeorm';
import { QueryParams } from 'typings';
import { paginateQuery } from 'utils';
import { AppID } from 'utils/app/assets';
import { LoginInput } from 'apps/boomemory/src/auth/dto/login.input';
import { compareSync } from 'bcrypt';
import { constants, privateDecrypt } from 'crypto';
import { ConfigService } from '@app/config';
import dayjs = require('dayjs');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, AppID.Boomemory)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserEmail, AppID.Boomemory)
    private readonly userEmailRepository: Repository<UserEmail>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 获取单个用户
   */
  async getUser(
    keyword: number | string,
    options?: Pick<FindOneOptions<User>, 'select' | 'relations'>,
  ) {
    // keyword 为空：抛出异常
    if (!keyword) {
      throw new Error('用户关键字不能为初始值！');
    }

    // 查询指定用户
    const user = await this.userRepository.findOne({
      ...options,
      where: [
        {
          id: keyword as number,
        },
        {
          username: keyword as string,
        },
        {
          emailAddress: keyword as string,
        },
      ],
    });

    return user;
  }

  /**
   * 创建用户
   */
  create(registerInput: RegisterInput) {
    const { password, emailAddress, ...register } = registerInput;

    // 注册密码解密
    const decryptedPassword = this.decryptByRsaPrivateKey(
      password,
      this.configService.getRsaPrivateKey(),
    );

    return this.userRepository.save(
      this.userRepository.create({
        ...register,
        password: decryptedPassword,
        emailAddress,
        email: {
          address: emailAddress,
        },
      }),
    );
  }

  /**
   * 分页查询用户
   */
  getUsers(query?: QueryParams<FilterUserInput>) {
    return paginateQuery(this.userRepository, {
      paginateInput: query?.paginateInput,
      filterInput: {
        ...(query?.filterInput?.ids && {
          id: In(query?.filterInput?.ids),
        }),

        ...(query?.filterInput?.excludeIds && {
          id: Not(In(query?.filterInput?.excludeIds)),
        }),
      },
    });
  }

  /**
   * 鉴于dataLoader常利用用户ids获取用户信息
   * 将上述逻辑提供为统一的API
   */
  async getUsers4UserIds(userIds: number[]) {
    const users = (
      await this.getUsers({
        filterInput: {
          ids: userIds,
        },
      })
    ).items;

    return userIds.map((userId) => users.find((user) => user.id === userId));
  }

  /**
   * 对登录信息进行认证
   * 与login接口区别：不返回token，直接返回用户信息
   */
  async authorize(payload: LoginInput) {
    // 认证
    const { id } = await this.getValidatedUser(payload);
    // 用户信息
    return await this.getUser(id);
  }

  /**
   * 验证用户名/密码
   */
  async getValidatedUser(payload: LoginInput) {
    // 根据关键字获取用户
    const user = await this.getUser(payload.keyword, {
      select: {
        id: true,
        password: true,
      },
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
   * 获取userEmail对象
   * 不存在则创建
   */
  async getOrGenerateUserEmail(emailAddress: string): Promise<UserEmail> {
    // 获取已经存在的
    const existed = await this.userEmailRepository.findOneBy({
      address: emailAddress,
    });

    // 不存在，生成新的userEmail
    if (!existed) {
      return await this.userEmailRepository.save(
        this.userEmailRepository.create({
          address: emailAddress,
        }),
      );
    }

    // 验证码存在有效期，验证码失效时，需要重新生成验证码
    if (dayjs().isAfter(existed.validTo)) {
      existed.generateCaptcha();
      existed.sentAt = null;
      this.userEmailRepository.save(existed);
    }

    return existed;
  }
}
