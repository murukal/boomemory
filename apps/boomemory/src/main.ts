import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');
import { getDynamicCorsOptions } from 'utils/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors(getDynamicCorsOptions);

  app.use(cookieParser());

  // await app.listen(3200);
  await app.listen(9000);

  console.log('http://localhost:3200');
}

bootstrap();
