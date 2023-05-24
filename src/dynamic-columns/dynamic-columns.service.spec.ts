import { Test, TestingModule } from '@nestjs/testing';
import { DynamicColumnsService } from './dynamic-columns.service';

describe('DynamicColumnsService', () => {
  let service: DynamicColumnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicColumnsService],
    }).compile();

    service = module.get<DynamicColumnsService>(DynamicColumnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
