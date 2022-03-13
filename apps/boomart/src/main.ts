import { NestFactory } from '@nestjs/core';
import { BoomartModule } from './boomart.module';

async function bootstrap() {
  const app = await NestFactory.create(BoomartModule);
  await app.listen(3000);
}
bootstrap();
