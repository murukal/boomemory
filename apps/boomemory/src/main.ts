import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');
import { getDynamicCorsOptions } from 'utils/cors';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors(getDynamicCorsOptions);

  app.use(cookieParser());

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3200;

  await app.listen(port);
  console.log(`http://localhost:${port}`);
}

bootstrap();
