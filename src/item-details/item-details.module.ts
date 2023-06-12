import { Module } from '@nestjs/common';
import { ItemDetailsService } from './item-details.service';
import { ItemDetailsController } from './item-details.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemDetail } from './entities/item-detail.entity';
import { ItemService } from '../item/item.service';
import { DynamicColumnsService } from '../dynamic-columns/dynamic-columns.service';
import { Item } from '../item/entities/item.entity';
import { DynamicColumn } from '../dynamic-columns/entities/dynamic-column.entity';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../common/all-exceptions.filter';

@Module({
  imports: [TypeOrmModule.forFeature([ItemDetail]), TypeOrmModule.forFeature([Item]), TypeOrmModule.forFeature([DynamicColumn])],
  controllers: [ItemDetailsController],
  providers: [ItemDetailsService, ItemService, DynamicColumnsService, {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  }]
})
export class ItemDetailsModule { }
