import { Global, Module } from '@nestjs/common';
import { ConfigModule as NativeConfigModule } from '@nestjs/config';
import { cosConfig, jwtConfig } from './assets';
import { portConfig } from './assets/port.config';
import { rsaConfig } from './assets/rsa.config';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [
    // 环境变量配置模块
    NativeConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, rsaConfig, portConfig, cosConfig],
      envFilePath: ['.env.development.local'],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
