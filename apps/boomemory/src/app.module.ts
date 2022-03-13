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

@Module({
  imports: [
    // 环境配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, rsaConfig],
    }),

    DataBaseModule,
    UserModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),

    TenantModule,

    AuthModule,

    MenuModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
