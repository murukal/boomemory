import { NestFactory } from '@nestjs/core';
import { BoomoneyModule } from './boomoney.module';

async function bootstrap() {
  const app = await NestFactory.create(BoomoneyModule);
  await app.listen(3000);
}
bootstrap();
