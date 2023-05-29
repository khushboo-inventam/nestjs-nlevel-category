import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ItemDetailsService } from './item-details.service';
import { CreateItemDetailDto } from './dto/create-item-detail.dto';
import { UpdateItemDetailDto } from './dto/update-item-detail.dto';
import { SearchTracksDto } from '../common/SearchTracksDto.dto';
// import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("item-details")
@Controller('item-details')
export class ItemDetailsController {
  constructor(private readonly itemDetailsService: ItemDetailsService) { }

  // @MessagePattern("item-details_create")
  @Post()
  create(@Body() createItemDetailDto: CreateItemDetailDto) {
    return this.itemDetailsService.create(createItemDetailDto);
  }

  // @MessagePattern("item-details_search_by_name")
  @Get()                                
  findAll(@Query() params?: SearchTracksDto) {
    return this.itemDetailsService.findAll(params);

  }

  @Get(':id')
  // @MessagePattern("item-details_search_by_item-details_id")

  findOne(@Param('id') id: string) {
    return this.itemDetailsService.findOne(+id);
  }

  @Patch(':id')
  // @MessagePattern("item-details_update_item-details_by_id")

  update(@Param('id') id: string, @Body() updateItemDetailDto: UpdateItemDetailDto) {
    return this.itemDetailsService.update(+id, updateItemDetailDto);
  }

  @Delete(':id')
  // @MessagePattern("item-details_delete_by_item-details_id")

  remove(@Param('id') id: string) {
    return this.itemDetailsService.remove(+id);
  }
}
