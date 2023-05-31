import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { setPagination, unixTimestamp } from '../common/pagination';

@Injectable()
export class ItemService {

  constructor(
    @InjectRepository(Item) private readonly repo: Repository<Item>
  ) { }

  async create(createItemDto: CreateItemDto) {
    let data
    try {

      data = await this.repo.save({
        ...createItemDto,
        // item_code: generatePublicId(),
        is_deleted: false,
        created_at: unixTimestamp().toString(),
      });
    } catch (error) {
      console.log('error ', error
      )
    }
    return data;
  }

  async findAll(params) {
    const pagination = setPagination(params);
    const whereCondition = { is_deleted: false };
    if (params?.search) {
      Object.assign(whereCondition, { name: ILike(`%${params?.search}%`) });
    }
    let data;
    try {
      // data = await this.repo.find({
      //   select: {
      //     name: true,
      //     item_id: true,
      //     item_code: true,
      //     item_de scription: true,
      //     image: true,
      //   },
      //   // join: {
      //   //   alias: "items",
      //   //   leftJoinAndSelect: {
      //   //     item: "items.item_id",
      //   //   },
      //   // },
      //   relations:{
      //     item_id : true
      //   },

      //   where: {
      //     ...whereCondition,
      //   },

      // });


      const QBData = await this.repo.createQueryBuilder("item").
        leftJoinAndSelect("item_details", "itemd", "itemd.item_id = item.item_id")
      //  // leftJoinAndSelect("item_details", "items", "items.itemItemId = item.item_id")
      console.log('data', data)
    } catch (error) {
      console.log('error', error)
    }

    return data;
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { is_deleted: false, item_id: id },
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
