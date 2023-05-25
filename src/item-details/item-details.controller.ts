import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemDetailsService } from './item-details.service';
import { CreateItemDetailDto } from './dto/create-item-detail.dto';
import { UpdateItemDetailDto } from './dto/update-item-detail.dto';

@Controller('item-details')
export class ItemDetailsController {
  constructor(private readonly itemDetailsService: ItemDetailsService) {}

  @Post()
  create(@Body() createItemDetailDto: CreateItemDetailDto) {
    return this.itemDetailsService.create(createItemDetailDto);
  }

  @Get()
  findAll() {
    return this.itemDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDetailDto: UpdateItemDetailDto) {
    return this.itemDetailsService.update(+id, updateItemDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemDetailsService.remove(+id);
  }
}
