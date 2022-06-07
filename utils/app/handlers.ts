import { ConfigModule, ConfigService } from '@app/config';
import { DataBaseModule } from '@app/data-base';
import { ObjectStorageModule } from '@app/object-storage';
import { UserModule } from '@app/user';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {
  INestApplication,
  ModuleMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import cookieParser = require('cookie-parser');
import { getDynamicCorsOptions } from 'utils/cors';
import { AppID } from './assets';

/**
 * 项目搭建方式为子项目搭建
 * 对每个子项目的入口app注册公用事件
 */
export const initialize = async (app: INestApplication, appId: AppID) => {
  // 设置允许跨域
  app.enableCors(getDynamicCorsOptions);

  // 使用cookie
  app.use(cookieParser());

  // 注册全局管道
  app.useGlobalPipes(new ValidationPipe());

  // app监听端口
  const configService = app.get(ConfigService);
  const port = configService.getPort(appId);
  await app.listen(port);

  // 输出地址
  console.log(`http://localhost:${port}`);
};

/**
 * 公用服务模块
 * 在多个子项目服务中，会产生许多冗余的代码和api，将这些冗余部分抽离，生成公共服务模块
 * 在子项目中引入，减少代码
 */
export const initializeCommonModules = (): ModuleMetadata['imports'] => [
  // 配置信息模块
  ConfigModule,

  // 数据库模块
  DataBaseModule,

  // 用户信息模块
  UserModule,

  // 对象存储模块
  ObjectStorageModule,

  // GraphQL 模块
  GraphQLModule.forRoot<ApolloDriverConfig>({
    autoSchemaFile: true,
    driver: ApolloDriver,
    cors: getDynamicCorsOptions,
  }),
];
