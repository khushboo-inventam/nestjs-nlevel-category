import { Test, TestingModule } from '@nestjs/testing';
import { DynamicColumnsController } from './dynamic-columns.controller';
import { DynamicColumnsService } from './dynamic-columns.service';

describe('DynamicColumnsController', () => {
  let controller: DynamicColumnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicColumnsController],
      providers: [DynamicColumnsService],
    }).compile();

    controller = module.get<DynamicColumnsController>(DynamicColumnsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
