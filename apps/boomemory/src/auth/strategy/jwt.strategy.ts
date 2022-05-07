import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@app/user';
import type { Request } from 'express';
import { Authentication } from '../dto/authentication';
import { User } from '@app/data-base/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        // 先从cookie里面获取token
        const token =
          req.cookies &&
          (req.cookies['__Secure-next-auth.session-token'] ||
            req.cookies['next-auth.session-token']);

        if (token) return token;

        // cookie中不存在，获取请求头
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: Authentication): Promise<User> {
    // token有效
    // 获取数据库中的user信息
    const user = await this.userService.getUser(payload.id);

    if (!user)
      throw new UnauthorizedException(
        '非常抱歉，服务端没有匹配到正确的用户信息！',
      );

    return user;
  }
}
