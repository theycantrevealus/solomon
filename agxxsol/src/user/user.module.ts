import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import env = require('dotenv');
env.config();
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: `${process.env.USER_EXCHANGE_NAME}`,
          type: `${process.env.USER_EXCHANGE_TYPE}`,
        },
        {
          name: `${process.env.AUTH_EXCHANGE_NAME}`,
          type: `${process.env.AUTH_EXCHANGE_TYPE}`,
        },
      ],
      uri: `${process.env.AMQP_CONNECTION}`,
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
