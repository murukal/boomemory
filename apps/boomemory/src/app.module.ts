import { DataBaseModule } from '@app/data-base';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantModule } from './tenant/tenant.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from '@app/user';
import { AppResolver } from './app.resolver';
import { MenuModule } from './menu/menu.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { DictionaryEnumModule } from './dictionary-enum/dictionary-enum.module';
import { RoleModule } from './role/role.module';
import { ObjectStorageModule } from '@app/object-storage';
import { getDynamicCorsOptions } from 'utils/cors';
import { ConfigModule } from '@app/config';

@Module({
  imports: [
    // 公用服务模块
    ConfigModule,
    DataBaseModule,
    UserModule,
    ObjectStorageModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      cors: getDynamicCorsOptions,
    }),

    // 项目服务模块
    TenantModule,
    AuthModule,
    MenuModule,
    DictionaryModule,
    DictionaryEnumModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
