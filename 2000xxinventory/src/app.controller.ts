import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('get_inventory')
  async getInventori(data: string) {
    console.log(`Signal Received ${data}`);
    return 'Hello Inventori';
  }

  @MessagePattern('get_inventory')
  async getMessageInventori(data: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    console.log(originalMessage);
    return originalMessage;
  }
}
