import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('get_inventory')
  async getInventori(data: string) {
    console.log(`Signal Received ${data}`);
    return 'Hello Inventori';
  }

  @MessagePattern('get_inventory')
  async getMessageInventori(data: string) {
    return 'Hello Inventori';
  }
}
