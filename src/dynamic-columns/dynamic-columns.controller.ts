import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, UsePipes, ValidationPipe, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { DynamicColumnsService } from './dynamic-columns.service';
import { CreateDynamicColumnDto } from './dto/create-dynamic-column.dto';
import { UpdateDynamicColumnDto } from './dto/update-dynamic-column.dto';
import { ApiTags } from '@nestjs/swagger';
import { SearchTracksDto } from '../common/SearchTracksDto.dto';
import { AllExceptionsFilter } from '../common/all-exceptions.filter';
import { MessagePattern } from '@nestjs/microservices';
import { DYNAMIC_COLUMNS } from '../common/global-constants';


@UseFilters(new AllExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("dynamic-columns")
@Controller('dynamic-columns')
export class DynamicColumnsController {
  constructor(private readonly dynamicColumnsService: DynamicColumnsService) { }

  @MessagePattern("dynamic_col_create")
  // @Post()
 async create(createDynamicColumnDto: CreateDynamicColumnDto) {

    const createData = await this.dynamicColumnsService.create(createDynamicColumnDto);
    return {
      data: createData,
      message: DYNAMIC_COLUMNS.CREATED
    }
  }
  @MessagePattern("dynamic_col_search_by_name")
  // @Get()
  async findAll(params?: SearchTracksDto) {

    const findAllData = await this.dynamicColumnsService.findAll(params);
    return {
      data: findAllData,
      message: findAllData.length !== 0 ? DYNAMIC_COLUMNS.FETCHED : DYNAMIC_COLUMNS.NOT_FOUND
    }
  }

  @MessagePattern("dynamic_col_search_by_dynamic_col_id")
  // @Get(':id')
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {

    const findOneData = await this.dynamicColumnsService.findOne(+id);
    return {
      data: findOneData,
      message: findOneData && findOneData !== undefined ? DYNAMIC_COLUMNS.FETCHED : DYNAMIC_COLUMNS.NOT_FOUND
    }
  }

  @MessagePattern("dynamic_col_update_dynamic_col_by_id")
  // @Patch(':id')
  async update(updateDynamicColumnDto: UpdateDynamicColumnDto) {
    const {dynamic_id, ...updateDynamicColumnObj} = updateDynamicColumnDto;
    const updateCatData = await this.dynamicColumnsService.update(+dynamic_id, updateDynamicColumnDto);
    return {
      data: updateCatData,
      message: DYNAMIC_COLUMNS.UPDATED
    }
  }

  @MessagePattern("dynamic_col_delete_by_dynamic_col_id")
  // @Delete(':id')
  async remove(id: string) {
    await this.dynamicColumnsService.remove(+id);
    return {
      message: DYNAMIC_COLUMNS.DELETED
    }
  }
}
