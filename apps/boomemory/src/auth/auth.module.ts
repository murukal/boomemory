import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthLoader } from './auth.loader';
import { ConfigModule, ConfigService } from '@app/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getJwtSecret(),
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy, AuthLoader],
  exports: [AuthService],
})
export class AuthModule {}
