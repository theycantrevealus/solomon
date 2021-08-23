import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import Tracing from '@sentry/tracing';
import env = require('dotenv');
import { SentryInterceptor } from './interceptors/sentry.interceptor';
env.config();

async function bootstrap() {
  Sentry.init({
    dsn: `${process.env.SENTRY_DSN}`,
  });
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new SentryInterceptor());
  const options = new DocumentBuilder()
    .setTitle('PONDOKCODER v0.0.9')
    .addTag('user')
    .setVersion('0.0.9')
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  await app.listen(process.env.PORT);
}
bootstrap();
