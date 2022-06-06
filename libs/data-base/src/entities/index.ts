import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import * as boomemory from './boomemory';
import * as boomart from './boomart';
import * as boomoney from './boomoney';
import { AppID } from 'utils/app/assets';

const boomemoryEntities = Object.values(boomemory);
const boomartEntities = Object.values(boomart);
const boomoneyEntities = Object.values(boomoney);

/**
 * 数据库连接
 */
const baseConnectionOptions: MysqlConnectionOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  synchronize: true,
};

export const boomemoryConnection = TypeOrmModule.forRoot({
  ...baseConnectionOptions,
  database: AppID.Boomemory,
  name: AppID.Boomemory,
  entities: boomemoryEntities,
});

export const boomartConnection = TypeOrmModule.forRoot({
  ...baseConnectionOptions,
  database: AppID.Boomart,
  name: AppID.Boomart,
  entities: boomartEntities,
});

export const boomoneyConnection = TypeOrmModule.forRoot({
  ...baseConnectionOptions,
  database: AppID.Boomoney,
  name: AppID.Boomoney,
  entities: boomoneyEntities,
});

/**
 * 注册数据库表
 */
export const boomemoryFeatures = TypeOrmModule.forFeature(
  boomemoryEntities,
  AppID.Boomemory,
);

export const boomartFeatures = TypeOrmModule.forFeature(
  boomartEntities,
  AppID.Boomart,
);

export const boomoneyFeatures = TypeOrmModule.forFeature(
  boomoneyEntities,
  AppID.Boomoney,
);
