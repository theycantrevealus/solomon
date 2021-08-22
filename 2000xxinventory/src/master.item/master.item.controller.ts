import { Controller, Get } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { getManager } from 'typeorm';
import { MasterItemService } from './master.item.service';
import { MasterItem } from '../model/inventory.master.item';
import { MasterItemDTO } from '../dto/inventory.master.item.dto';
import { Crud } from '@nestjsx/crud';

@Crud({
  model: {
    type: MasterItem,
  },
})
@Controller('master_item')
export class MasterItemController {
  constructor(private serv: MasterItemService) {}

  @Get()
  public async getAll() {
    return await this.serv.getAll();
  }
}
