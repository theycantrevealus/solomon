import { Test, TestingModule } from '@nestjs/testing';
import { Master.ItemService } from './master.item.service';

describe('Master.ItemService', () => {
  let service: Master.ItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Master.ItemService],
    }).compile();

    service = module.get<Master.ItemService>(Master.ItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
