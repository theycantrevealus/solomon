import { Test, TestingModule } from '@nestjs/testing';
import { Master.ItemController } from './master.item.controller';

describe('Master.ItemController', () => {
  let controller: Master.ItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Master.ItemController],
    }).compile();

    controller = module.get<Master.ItemController>(Master.ItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
