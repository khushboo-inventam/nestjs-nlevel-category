import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, ValidationPipe, UsePipes } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { SearchTracksDto } from 'src/common/SearchTracksDto.dto';
import { AllExceptionsFilter } from 'src/common/all-exceptions.filter';
import { ApiTags } from '@nestjs/swagger';

// @UseFilters(new AllExceptionsFilter())
// @UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("item")
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll(@Query() params?: SearchTracksDto) {
    return this.itemService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
