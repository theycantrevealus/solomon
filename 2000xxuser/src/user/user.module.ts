import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { configService } from '../config/orm.auto';
import { UserModel } from '../model/user.model';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { LoggerMiddleware } from '../middleware/logger.middleware';
import env = require('dotenv');
import { AuthMiddleware } from '../middleware/auth.middleware';

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
export class UserModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({
        path: 'user/login',
        method: RequestMethod.POST,
      })
      .forRoutes(
        {
          path: 'user',
          method: RequestMethod.GET,
        },
        {
          path: 'user',
          method: RequestMethod.POST,
        },
        {
          path: 'user',
          method: RequestMethod.PUT,
        },
        {
          path: 'user',
          method: RequestMethod.DELETE,
        },
      );
  }
}
