import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitRPC } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /*@RabbitRPC({
    exchange: 'inventory',
    routingKey: 'inventory.process1',
    queue: 'queue1',
  })
  rpc1(msg) {
    console.log('Event 1');
    console.log(`Received message: ${JSON.stringify(msg)}`);
    return '';
  }

  @RabbitRPC({
    exchange: 'solomon_user',
    routingKey: 'user_service_registration',
    queue: 'user_service_queue',
    errorHandler: ackErrorHandler,
  })
  rpc1(msg) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
    return '';
  }

  @RabbitRPC({
    exchange: 'inventory',
    routingKey: 'inventory.process2',
    queue: 'queue2',
  })
  rpc2(msg) {
    console.log('Event 2');
    console.log(`Received message: ${JSON.stringify(msg)}`);
    return '';
  }*/
}
