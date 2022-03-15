import { Authorization, CONNECTION_BOOMEMORY } from '@app/data-base/entities';
import { UserService } from '@app/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { constants, privateDecrypt } from 'crypto';
import { Repository } from 'typeorm';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Authorization, CONNECTION_BOOMEMORY)
    private readonly authorizationRepository: Repository<Authorization>,
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
    return privateDecrypt(
      { key: privateKey, padding: constants.RSA_PKCS1_PADDING },
      Buffer.from(encoding, 'base64'),
    ).toString();
  }

  /**
   * 查询多个用户
   */
  getUsers() {
    return this.userService.getUsers();
  }

  /**
   * 查询多个权限
   */
  getAuthorizations() {
    return this.authorizationRepository.find();
  }
}
