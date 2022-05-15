import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

/**
 * 统一entity的入口文件
 */
export * from './core.entity';

import * as boomemory from './boomemory';
import * as boomart from './boomart';
import * as boomoney from './boomoney';

const boomemoryEntities = Object.values(boomemory);
const boomartEntities = Object.values(boomart);
const boomoneyEntities = Object.values(boomoney);

/**
 * 数据库连接
 */
export const CONNECTION_BOOMART = 'boomart';
export const CONNECTION_BOOMEMORY = 'boomemory';
export const CONNECTION_BOOMONEY = 'boomoney';

const baseConnectionOptions: MysqlConnectionOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  synchronize: true,
};

export const boomemoryConnection = TypeOrmModule.forRoot({
  ...baseConnectionOptions,
  database: CONNECTION_BOOMEMORY,
  name: CONNECTION_BOOMEMORY,
  entities: boomemoryEntities,
});

export const boomartConnection = TypeOrmModule.forRoot({
  ...baseConnectionOptions,
  database: CONNECTION_BOOMART,
  name: CONNECTION_BOOMART,
  entities: boomartEntities,
});

export const boomoneyConnection = TypeOrmModule.forRoot({
  ...baseConnectionOptions,
  database: CONNECTION_BOOMONEY,
  name: CONNECTION_BOOMONEY,
  entities: boomoneyEntities,
});

/** 注册数据库表 */
export const boomemoryFeatures = TypeOrmModule.forFeature(
  boomemoryEntities,
  CONNECTION_BOOMEMORY,
);

export const boomartFeatures = TypeOrmModule.forFeature(
  boomartEntities,
  CONNECTION_BOOMART,
);

export const boomoneyFeatures = TypeOrmModule.forFeature(
  boomoneyEntities,
  CONNECTION_BOOMONEY,
);
