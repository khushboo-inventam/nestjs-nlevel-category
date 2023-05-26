import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DynamicColumnsService } from './dynamic-columns.service';
import { CreateDynamicColumnDto } from './dto/create-dynamic-column.dto';
import { UpdateDynamicColumnDto } from './dto/update-dynamic-column.dto';
import { ApiTags } from '@nestjs/swagger';
import { SearchTracksDto } from '../common/SearchTracksDto.dto';


@ApiTags("dynamic-columns")
@Controller('dynamic-columns')
export class DynamicColumnsController {
  constructor(private readonly dynamicColumnsService: DynamicColumnsService) {}

  @Post()
  create(@Body() createDynamicColumnDto: CreateDynamicColumnDto) {
    return this.dynamicColumnsService.create(createDynamicColumnDto);
  }

  @Get()
  findAll(@Query() params?: SearchTracksDto) {
    return this.dynamicColumnsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dynamicColumnsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDynamicColumnDto: UpdateDynamicColumnDto) {
    return this.dynamicColumnsService.update(+id, updateDynamicColumnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dynamicColumnsService.remove(+id);
  }
}
