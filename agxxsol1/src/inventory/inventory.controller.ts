import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('inventory')
export class InventoryController {
  constructor(
    @Inject('INVENTORY_GATEWAY') private readonly client: ClientProxy,
  ) {}

  @Get('get_all')
  async getInventori() {
    const responseData = await firstValueFrom(
      this.client.send<any>('get_inventory', 'hi there'),
    );
    console.log(responseData);

    return 'inventory_module';
  }
}
