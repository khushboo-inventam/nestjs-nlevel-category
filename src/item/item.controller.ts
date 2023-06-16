import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, ValidationPipe, UsePipes, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { SearchTracksDto } from '../common/SearchTracksDto.dto';
import { AllExceptionsFilter } from '../common/all-exceptions.filter';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { ITEM } from '../common/global-constants';

@UseFilters(new AllExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("item")
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }

    @MessagePattern("item_create")
  // @Post()
  async create(createItemDto: CreateItemDto) {

    const createData = await this.itemService.create(createItemDto);
    return {
      data: createData,
      message: ITEM.CREATED

    }
  }

  //  @MessagePattern("item_search_by_name")
  @Get()
  async findAll(@Query() params?: SearchTracksDto) {
    const findAllData = await this.itemService.findAll(params);
    return {
      data: findAllData,
      message: findAllData.length !== 0 ? ITEM.FETCHED : ITEM.NOT_FOUND
    }
  }
  // 

  @MessagePattern("item_search_by_item_id")
  // @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    const findOneData = await this.itemService.findOne(+id);
    return {
      data: findOneData,
      message: findOneData && findOneData !== undefined ? ITEM.FETCHED : ITEM.NOT_FOUND
    }
  }


  @MessagePattern("item_update_item_by_id")
  // @Patch(':id')
  async update(updateItemDto: UpdateItemDto) {
    const {item_id, ...updateItemObj} = updateItemDto;
    const updateData = await this.itemService.update(+item_id, updateItemObj);
    return {
      data: updateData,
      message: ITEM.UPDATED
    }
  }

  @MessagePattern("item_delete_by_item_id")
  // @Delete(':id')
  async remove(id: string) {
    await this.itemService.remove(+id);
    return {
      message: ITEM.DELETED
    }
  }
}
