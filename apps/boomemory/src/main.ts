import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initialize } from 'utils/app/handlers';
import { AppID } from 'utils/app/assets';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 初始化app
  await initialize(app, AppID.Boomemory);
}

bootstrap();
