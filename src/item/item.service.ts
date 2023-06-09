import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';
import { Item } from './entities/item.entity';
import { setPagination, unixTimestamp } from '../common/pagination';
import { ItemDetail } from '../item-details/entities/item-detail.entity';
import { DynamicColumn } from '../dynamic-columns/entities/dynamic-column.entity';

@Injectable()
export class ItemService {

  constructor(
    @InjectRepository(Item) private readonly repo: Repository<Item>,
    @InjectRepository(ItemDetail) private readonly itemDetail: Repository<ItemDetail>,
    @InjectRepository(DynamicColumn) private readonly dynamicColumn: Repository<DynamicColumn>
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

    let sortColumns = {};
    let searchData = ""
    if (!params?.sort_column) sortColumns = { sort_column: 'cat.created_at' }
    if (params?.search) {
      searchData = "and ( item.name ilike :name or ItemDetail.value ilike :name or dynamicCol.name ilike :name)"
    }
    let pagination = setPagination(Object.assign(params, sortColumns));
    let data

  
    // const itemDetail = await this.itemDetail.createQueryBuilder("ItemDetail")

    //   //.leftJoinAndMapMany('item.item_details', 'item_details', 'ItemDetail', 'ItemDetail.item_id = item.item_id and  ItemDetail.is_deleted = :isDelete', { isDelete: false })
    //   //  .innerJoinAndSelect(DynamicColumn, "col", "col.dynamic_id = ItemDetail.dynamic_id")
    //   .innerJoinAndMapMany('ItemDetail.dyn', 'dynamic_column', 'dynamicCol', 'dynamicCol.dynamic_id = ItemDetail.dynamic_id and dynamicCol.is_deleted = :isDelete', { isDelete: false })
    //   //.select(['item.item_id', 'item.name'])
    //   .addSelect([
    //     'ItemDetail.value',
    //     'dynamicCol.name',
    //   ])
    //   .take(pagination.take)
    //   //  .skip(pagination.skip)
    //   .getMany();
    // console.log('itemDetail', itemDetail  )
    try {
      data = this.repo.createQueryBuilder("item")
        .leftJoinAndMapMany('item.item_details', 'item_details', 'ItemDetail', 'ItemDetail.item_id = item.item_id and  ItemDetail.is_deleted = :isDelete', { isDelete: false })
        //  .innerJoinAndSelect(DynamicColumn, "col", "col.dynamic_id = ItemDetail.dynamic_id")
        .innerJoinAndMapMany('ItemDetail.dyn', 'dynamic_column', 'dynamicCol', 'dynamicCol.dynamic_id = ItemDetail.dynamic_id and dynamicCol.is_deleted = :isDelete', { isDelete: false })
        .select(['item.item_id', 'item.name'])
        .addSelect([
          'ItemDetail.value',
          'dynamicCol.name',
        ])
        .take(pagination.take)
        //  .skip(pagination.skip)
        .getMany();

    } catch (error) {
      console.log('error', error)
    }


    // const group = {};

    // // data.forEach(({ item_name, ...rest }) => {
    // //   group[item_name] = group[item_name] || { item_name, item_data: [] };
    // //   group[item_name].item_data.push(rest)
    // // })


    // console.log(Object.values(group))
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
