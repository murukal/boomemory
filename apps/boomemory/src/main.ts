import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initialize } from 'utils/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 初始化app
  await initialize(app);
}

bootstrap();
