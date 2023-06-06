import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { DynamicColumnsService } from './dynamic-columns.service';
import { CreateDynamicColumnDto } from './dto/create-dynamic-column.dto';
import { UpdateDynamicColumnDto } from './dto/update-dynamic-column.dto';
import { ApiTags } from '@nestjs/swagger';
import { SearchTracksDto } from '../common/SearchTracksDto.dto';
import { AllExceptionsFilter } from '../common/all-exceptions.filter';
import { MessagePattern } from '@nestjs/microservices';


// @UseFilters(new AllExceptionsFilter())
// @UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("dynamic-columns")
@Controller('dynamic-columns')
export class DynamicColumnsController {
  constructor(private readonly dynamicColumnsService: DynamicColumnsService) { }

  // @MessagePattern("dynamic_col_create")
  @Post()
  create(@Body() createDynamicColumnDto: CreateDynamicColumnDto) {
    return this.dynamicColumnsService.create(createDynamicColumnDto);
  }
  // @MessagePattern("dynamic_col_search_by_name")
  @Get()
  findAll(@Query() params?: SearchTracksDto) {
    return this.dynamicColumnsService.findAll(params);
  }

  // @MessagePattern("dynamic_col_search_by_dynamic_col_id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dynamicColumnsService.findOne(+id);
  }

  // @MessagePattern("dynamic_col_update_dynamic_col_by_id")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDynamicColumnDto: UpdateDynamicColumnDto) {
    return this.dynamicColumnsService.update(+id, updateDynamicColumnDto);
  }

  // @MessagePattern("dynamic_col_delete_by_dynamic_col_id")
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dynamicColumnsService.remove(+id);
  }
}
