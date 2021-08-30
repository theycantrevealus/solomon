import { Module } from '@nestjs/common';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/orm.config';
import { UserModel } from '../model/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
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
      ],
      uri: `${process.env.AMQP_CONNECTION}`,
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([UserModel], 'default'),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {
  constructor(private readonly amqpConnection: AmqpConnection) {}
}
