import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [/localhost/, /fantufantu/],
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(3200);

  console.log('http://localhost:3200');
}

bootstrap();
