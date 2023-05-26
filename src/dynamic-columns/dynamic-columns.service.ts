import { Injectable } from '@nestjs/common';
import { CreateDynamicColumnDto } from './dto/create-dynamic-column.dto';
import { UpdateDynamicColumnDto } from './dto/update-dynamic-column.dto';
import { DynamicColumn } from './entities/dynamic-column.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { setPagination, unixTimestamp } from '../common/pagination';

@Injectable()
export class DynamicColumnsService {


  constructor(
    @InjectRepository(DynamicColumn) private readonly repo: Repository<DynamicColumn>
  ) { }

  async create(createDynamicColumnDto: CreateDynamicColumnDto) {
    const data = await this.repo.save({
      ...createDynamicColumnDto,
      // item_code: generatePublicId(),
      created_at: unixTimestamp().toString(),
    });
    return data;
  }

  async findAll(params) {
    const pagination = setPagination(params);
    const whereCondition = { is_deleted: false };
    if (params?.search) {
      Object.assign(whereCondition, { name: ILike(`%${params?.search}%`) });
    }
    const data = await this.repo.find({
      select: {
        dynamic_id: true,
        name: true,
        type: true,
      },

      where: {
        ...whereCondition,
      },
      ...pagination,
    });
    return data;
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: {   is_deleted:false, dynamic_id: id },
    });
  }

  update(id: number, updateDynamicColumnDto: UpdateDynamicColumnDto) {
    return this.repo.update(
      { dynamic_id: id },
      {
        ...updateDynamicColumnDto,
        updated_at: unixTimestamp().toString(),
      }
    );
  }

  remove(id: number) {
    return this.repo.update(
      { dynamic_id: id },
      { is_deleted: true, deleted_at: unixTimestamp().toString() }
    );
  }
}
