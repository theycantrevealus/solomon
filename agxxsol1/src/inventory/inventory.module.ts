import 'dotenv/config';
import { Module } from '@nestjs/common';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INVENTORY_GATEWAY',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_CONNECTION],
          queue: 'solomon_inventory_item',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
