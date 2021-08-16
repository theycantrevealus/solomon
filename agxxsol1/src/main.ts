import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1', {
    exclude: [
      {
        path: 'authorities',
        method: RequestMethod.GET,
      },
    ],
  });
  await app.listen(3000);
}
bootstrap();
