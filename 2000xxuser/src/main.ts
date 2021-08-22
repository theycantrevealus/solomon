import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import env = require('dotenv');
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
env.config();
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: process.env.PORT,
    },
  });
  app.useGlobalPipes(new ValidationPipe({ skipUndefinedProperties: true }));
  await app.listen();
}
bootstrap();
