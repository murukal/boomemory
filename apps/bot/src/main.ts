import { NestFactory } from '@nestjs/core';
import { AppID } from 'utils/app/assets';
import { initialize } from 'utils/app/handlers';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await initialize(app, AppID.Bot);
}

bootstrap();
