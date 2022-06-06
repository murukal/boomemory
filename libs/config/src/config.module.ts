import { Global, Module } from '@nestjs/common';
import {
  ConfigModule as NativeConfigModule,
  ConfigService,
} from '@nestjs/config';
import { jwtConfig } from './assets';
import { rsaConfig } from './assets/rsa.config';

@Global()
@Module({
  imports: [
    // 环境变量配置模块
    NativeConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, rsaConfig],
      envFilePath: ['.env.development.local'],
    }),
  ],
  providers: [ConfigService],
})
export class ConfigModule {}
