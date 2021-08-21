import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import env = require('dotenv');
env.config();
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly service: UserService,
    private readonly amqpConnection: AmqpConnection,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    /*this.amqpConnection.publish(
      `${process.env.USER_EXCHANGE_NAME}`,
      'authentication',
      '',
    );*/
    //Todo : Suppose to send auth checker to auth MS
    console.log(req);
    next();
  }
}
