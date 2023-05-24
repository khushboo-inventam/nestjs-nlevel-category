import { Injectable } from '@nestjs/common';
import { CreateDynamicColumnDto } from './dto/create-dynamic-column.dto';
import { UpdateDynamicColumnDto } from './dto/update-dynamic-column.dto';

@Injectable()
export class DynamicColumnsService {
  create(createDynamicColumnDto: CreateDynamicColumnDto) {
    return 'This action adds a new dynamicColumn';
  }

  findAll() {
    return `This action returns all dynamicColumns`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dynamicColumn`;
  }

  update(id: number, updateDynamicColumnDto: UpdateDynamicColumnDto) {
    return `This action updates a #${id} dynamicColumn`;
  }

  remove(id: number) {
    return `This action removes a #${id} dynamicColumn`;
  }
}
