import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export * from './core.entity';
export * from './boomemory';
// export * from './boomart';

import * as boomemory from './boomemory';
// import * as boomartEntities from './boomart';

const boomemoryEntities = Object.values(boomemory);

/** 生成数据库连接 */
export const CONNECTION_BOOMART = 'boomart';
export const CONNECTION_BOOMEMORY = 'boomemory';

const baseConnectionOptions: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
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
});

/** 注册数据库表 */
export const boomemoryFeatures = TypeOrmModule.forFeature(
  boomemoryEntities,
  CONNECTION_BOOMEMORY,
);
