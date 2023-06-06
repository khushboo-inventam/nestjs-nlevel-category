import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, ValidationPipe, UsePipes } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { SearchTracksDto } from '../common/SearchTracksDto.dto';
import { AllExceptionsFilter } from '../common/all-exceptions.filter';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';

// @UseFilters(new AllExceptionsFilter())
// @UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("item")
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }

  // @MessagePattern("item_create")
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  //  @MessagePattern("item_search_by_name")
  @Get()
  findAll(@Query() params?: SearchTracksDto) {
    return this.itemService.findAll(params);
  }
  // 

  // @MessagePattern("item_search_by_item_id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }


  // @MessagePattern("item_update_item_by_id")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  // @MessagePattern("item_delete_by_item_id")
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
