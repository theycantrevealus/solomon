import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryModule } from './inventory/inventory.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    InventoryModule,
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
  controllers: [AppController, InventoryController],
  providers: [AppService],
})
export class AppModule {}
