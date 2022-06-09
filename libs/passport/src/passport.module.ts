import { Global, Module } from '@nestjs/common';
import { PassportService } from './passport.service';
import { PassportModule as NativePassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@app/config';
import { JwtStrategy } from './strategy';

@Global()
@Module({
  imports: [
    // 认证模块
    NativePassportModule,

    // jwt模块
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getJwtSecret(),
      }),
    }),
  ],
  providers: [PassportService, JwtStrategy],
  exports: [PassportService],
})
export class PassportModule {}
