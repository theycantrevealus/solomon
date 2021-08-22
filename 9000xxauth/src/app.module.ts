import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { JwtModule } from '@nestjs/jwt';
import env = require('dotenv');
env.config();
@Module({
  imports: [
    JwtModule.register({
      secret: 'taknakal',
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: `${process.env.AUTH_EXCHANGE_NAME}`,
          type: `${process.env.AUTH_EXCHANGE_TYPE}`,
        },
      ],
      uri: `${process.env.AMQP_CONNECTION}`,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
