import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  await app.listen(9999);

  console.log('http://localhost:9999/graphql');
}
bootstrap();
