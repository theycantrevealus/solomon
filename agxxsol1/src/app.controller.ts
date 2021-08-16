import { Controller, Get, Inject, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('INVENTORY_GATEWAY') private readonly client: ClientProxy,
    private readonly appService: AppService,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('inventory')
  getInventory(@Res() res) {
    return res.redirect('inventory/get_all');
  }
}
