import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`${process.env.AMQP_CONNECTION}`],
      queue: 'solomon-log',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen().then(() => console.log('Microservice is listening'));
}
bootstrap();
