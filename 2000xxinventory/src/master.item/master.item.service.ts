import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MasterItem } from '../model/inventory.master.item';
import { MasterItemDTO } from '../dto/inventory.master.item.dto';
import { Repository } from 'typeorm';

@Injectable()
export class MasterItemService {
  constructor(
    @InjectRepository(MasterItem)
    private readonly repo: Repository<MasterItem>,
  ) {}

  public async getAll(): Promise<MasterItemDTO[]> {
    return await this.repo
      .find()
      .then((items) => items.map((e) => MasterItemDTO.createEntity(e)));
  }
}
