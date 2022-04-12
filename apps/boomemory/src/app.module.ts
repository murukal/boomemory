import { DataBaseModule } from '@app/data-base';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './tenant/tenant.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@app/user';
import { jwtConfig } from './config';
import { rsaConfig } from './config/rsa.config';
import { AppResolver } from './app.resolver';
import { MenuModule } from './menu/menu.module';
import { BoomartModule } from 'apps/boomart/src/boomart.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { DictionaryEnumModule } from './dictionary-enum/dictionary-enum.module';
import { RoleModule } from './role/role.module';
import { ObjectStorageModule } from '@app/object-storage';
import { getDynamicCorsOptions } from 'utils/cors';

@Module({
  imports: [
    // 环境配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, rsaConfig],
      envFilePath: ['.env.development.local'],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      cors: getDynamicCorsOptions,
    }),

    // 公用服务模块
    DataBaseModule,
    UserModule,
    ObjectStorageModule,
    TenantModule,
    AuthModule,
    MenuModule,
    DictionaryModule,
    DictionaryEnumModule,
    RoleModule,

    // 第三方服务
    BoomartModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
