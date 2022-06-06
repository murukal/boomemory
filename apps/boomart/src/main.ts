import { NestFactory } from '@nestjs/core';
import { initialize } from 'utils/application';
import { BoomartModule } from './boomart.module';

async function bootstrap() {
  const app = await NestFactory.create(BoomartModule);
  await initialize(app);
}
bootstrap();
