import { Test, TestingModule } from '@nestjs/testing';
import { ItemDetailsController } from './item-details.controller';
import { ItemDetailsService } from './item-details.service';

describe('ItemDetailsController', () => {
  let controller: ItemDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemDetailsController],
      providers: [ItemDetailsService],
    }).compile();

    controller = module.get<ItemDetailsController>(ItemDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
