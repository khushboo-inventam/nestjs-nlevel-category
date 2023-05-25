import { Module } from '@nestjs/common';
import { ItemDetailsService } from './item-details.service';
import { ItemDetailsController } from './item-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemDetail } from './entities/item-detail.entity';
import { ItemService } from 'src/item/item.service';
import { DynamicColumnsService } from 'src/dynamic-columns/dynamic-columns.service';
import { Item } from 'src/item/entities/item.entity';
import { DynamicColumn } from 'src/dynamic-columns/entities/dynamic-column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemDetail]), TypeOrmModule.forFeature([Item]), TypeOrmModule.forFeature([DynamicColumn])],
  controllers: [ItemDetailsController],
  providers: [ItemDetailsService, ItemService, DynamicColumnsService]
})
export class ItemDetailsModule { }
