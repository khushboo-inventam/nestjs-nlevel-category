import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DynamicColumnsService } from './dynamic-columns.service';
import { CreateDynamicColumnDto } from './dto/create-dynamic-column.dto';
import { UpdateDynamicColumnDto } from './dto/update-dynamic-column.dto';

@Controller('dynamic-columns')
export class DynamicColumnsController {
  constructor(private readonly dynamicColumnsService: DynamicColumnsService) {}

  @Post()
  create(@Body() createDynamicColumnDto: CreateDynamicColumnDto) {
    return this.dynamicColumnsService.create(createDynamicColumnDto);
  }

  @Get()
  findAll() {
    return this.dynamicColumnsService.findAll();
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
