import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { setPagination, unixTimestamp } from 'src/common/pagination';

@Injectable()
export class ItemService {

  constructor(
    @InjectRepository(Item) private readonly repo: Repository<Item>
  ) { }

  async create(createItemDto: CreateItemDto) {

    const data = await this.repo.save({
      ...createItemDto,
      // item_code: generatePublicId(),
      created_at: unixTimestamp().toString(),
    });
    return data;
  }

  async findAll(params) {
    const pagination = setPagination(params);
    const whereCondition =  {is_deleted : false };
    if (params?.search) {
      Object.assign(whereCondition, { name: ILike(`%${params?.search}%`) });
    }
    const data = await this.repo.find({
      select: {
        name: true,
        item_id: true,
        item_code: true,
        item_description: true,
        image: true,

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
      where: { is_deleted  : false  ,item_id: id },
    });
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return this.repo.update(
      { item_id: id },
      {
        ...updateItemDto,
        updated_at: unixTimestamp().toString(),
      }
    );
  }

  remove(id: number) {
    return this.repo.update(
      { item_id: id },
      { is_deleted: true, deleted_at: unixTimestamp().toString() }
    );
  }
}
