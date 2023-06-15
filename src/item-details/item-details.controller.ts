import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, UsePipes, ValidationPipe, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ItemDetailsService } from './item-details.service';
import { CreateItemDetailDto } from './dto/create-item-detail.dto';
import { UpdateItemDetailDto } from './dto/update-item-detail.dto';
import { SearchTracksDto } from '../common/SearchTracksDto.dto';
// import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { AllExceptionsFilter } from '../common/all-exceptions.filter';
import { MessagePattern } from '@nestjs/microservices';
import { ITEM_DETAILS } from 'src/common/global-constants';

// @UseFilters(new AllExceptionsFilter())
// @UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("item-details")
@Controller('item-details')
export class ItemDetailsController {
  constructor(private readonly itemDetailsService: ItemDetailsService) { }

  // @MessagePattern("item-details_create")
  @Post()
  async create(@Body() createItemDetailDto: CreateItemDetailDto) {
    const createData = await this.itemDetailsService.create(createItemDetailDto);
    return { data: createData, message: ITEM_DETAILS.CREATED }
  }

  // @MessagePattern("item-details_search_by_name")
  @Get()
  async findAll(@Query() params?: SearchTracksDto) {
    const findAllData = await this.itemDetailsService.findAll(params);
    return { data: findAllData, message: findAllData && findAllData.length > 0 ? ITEM_DETAILS.FETCHED : ITEM_DETAILS.NOT_FOUND }

  }

  @Get(':id')
  // @MessagePattern("item-details_search_by_item-details_id")
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    const findOneData = - await this.itemDetailsService.findOne(+id);
    return { data: findOneData, message: findOneData && findOneData !== undefined ? ITEM_DETAILS.FETCHED : ITEM_DETAILS.NOT_FOUND }

  }

  @Patch(':id')
  // @MessagePattern("item-details_update_item-details_by_id")
  async update(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string, @Body() updateItemDetailDto: UpdateItemDetailDto) {
    const updateData = await this.itemDetailsService.update(+id, updateItemDetailDto);
    return { data: updateData, message: ITEM_DETAILS.UPDATED }
  }

  @Delete(':id')
  // @MessagePattern("item-details_delete_by_item-details_id")
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    await this.itemDetailsService.remove(+id);
    return { message: ITEM_DETAILS.DELETED }
  }
}
