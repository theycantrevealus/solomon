import { Test, TestingModule } from '@nestjs/testing';
import { LogActivityService } from './log-activity.service';

describe('LogActivityService', () => {
  let service: LogActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogActivityService],
    }).compile();

    service = module.get<LogActivityService>(LogActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
