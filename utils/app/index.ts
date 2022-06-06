import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser = require('cookie-parser');

/**
 * App ID 枚举
 */
export enum AppID {
  Boomemory = 'boomemory',
  Boomart = 'boomart',
  Boomoney = 'boomoney',
  Bot = 'bot',
}

/**
 * 项目搭建方式为子项目搭建
 * 对每个子项目的入口app注册公用事件
 */
export const initialize = async (app: INestApplication, appID?: AppID) => {
  // 设置允许跨域
  app.enableCors();

  // 使用cookie
  app.use(cookieParser());

  // 注册全局管道
  app.useGlobalPipes(new ValidationPipe());

  // app监听端口
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3200;

  await app.listen(port);
  console.log(`http://localhost:${port}`);
};
