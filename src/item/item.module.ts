import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { Item } from './entities/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicColumn } from '../dynamic-columns/entities/dynamic-column.entity';
import { ItemDetail } from '../item-details/entities/item-detail.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([ItemDetail]), TypeOrmModule.forFeature([Item]), TypeOrmModule.forFeature([DynamicColumn])],
  controllers: [ItemController],
  providers: [ItemService],

})
export class ItemModule {}
