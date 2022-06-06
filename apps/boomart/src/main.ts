import { NestFactory } from '@nestjs/core';
import { AppID } from 'utils/app/assets';
import { initialize } from 'utils/app/handlers';
import { BoomartModule } from './boomart.module';

async function bootstrap() {
  const app = await NestFactory.create(BoomartModule);
  await initialize(app, AppID.Boomart);
}
bootstrap();
