import { NestFactory } from '@nestjs/core';
import { AppID } from 'utils/app/assets';
import { initialize } from 'utils/app/handlers';
import { BoomoneyModule } from './boomoney.module';

async function bootstrap() {
  const app = await NestFactory.create(BoomoneyModule);
  await initialize(app, AppID.Boomoney);
}

bootstrap();
