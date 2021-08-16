import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Message } from './message.event';

@Controller()
export class AppController {
  constructor(@Inject('HELLO_SERVICE') private readonly client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  @Get()
  getHello() {
    this.client.emit<any>(
      'user_login',
      new Message({
        user_uid: '8113652d-4cb7-e850-d487-281a1762042a',
        table_name: 'coba',
        action: 'N',
        logged_at: '2020-12-08 15:46:04',
        old_value: 'Tester Old',
        new_value: 'Tester New',
        status: 'N',
        login_id: 1,
        unique_target: '8113652d-4cb7-e850-d487-281a1762042a',
      }),
    );
    return 'Hello World printed';
  }
}
