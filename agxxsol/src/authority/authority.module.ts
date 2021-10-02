import { Module } from '@nestjs/common';
import env = require('dotenv');
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AuthorityService } from './authority.service';
import { AuthorityController } from './authority.controller';
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
  providers: [AuthorityService],
  controllers: [AuthorityController],
  exports: [AuthorityService],
})
export class AuthorityModule {}
