import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterItem } from '../model/inventory.master.item';
import { MasterItemService } from './master.item.service';
import { configService } from '../config/orm.config';
import { MasterItemController } from './master.item.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([MasterItem], 'default'),
  ],
  providers: [MasterItemService],
  controllers: [MasterItemController],
  exports: [MasterItemService],
})
export class MasterItemModule {}
