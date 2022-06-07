import { NestFactory } from '@nestjs/core';
import { AppID } from 'utils/app/assets';
import { initialize } from 'utils/app/handlers';
import { BotModule } from './bot.module';

async function bootstrap() {
  const app = await NestFactory.create(BotModule);
  await initialize(app, AppID.Bot);
}

bootstrap();
