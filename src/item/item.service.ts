import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository, } from 'typeorm';
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
    const pagination = setPagination(params);
    const whereCondition = { is_deleted: false };
    if (params?.search) {
      Object.assign(whereCondition, { name: ILike(`%${params?.search}%`) });
    }

    let data




    let retdata
    try {

      // data = await this.repo.find({
      //   select: {
      //     item_id: true,
      //     name: true,
      //   },

      //   join: {
      //     alias: "item",
      //     leftJoinAndSelect: {
      //       dynamic_id: "itemdetail.dynamic_id",
      //       item_id: "itemdetail.item_id",
      //     },
      //   },
      //   where: {
      //     //dynamic_id: true,
      //     // item_id: true,

      //     ...whereCondition,
      //   },
      //   // ...pagination,
      // });

      // let itemDetailData = await this.itemDetail.createQueryBuilder("id")
      //   .select(['id.item_id', 'id.value', 'col.name as key'])
      //   .innerJoinAndSelect(DynamicColumn, "col", "col.dynamic_id = id.dynamic_id")
      //   .getMany()
      //   console.log('itemDetailData', itemDetailData)

      //  retdata = await itemDetailData.leftJoinAndSelect('item', "i", "i.item_id=id.item_id").getRawMany()
      // console.log('retdata------>',retdata)
      //.JoinAndSelect(DynamicColumn, "col", "col.dynamic_id = id.dynamic_id")

      // data = await this.repo.createQueryBuilder("item")
      // // .leftJoinAndSelect(ItemDetail, "item_details", "item_details.item_id = item.item_id")
      //   .leftJoinAndMapMany('item.itemd',ItemDetail,"itemd", "itemd.item_id = item.item_id")
      //   // .leftJoinAndSelect(DynamicColumn, "col", "col.dynamic_id = itemd.dynamic_id")
      //   .innerJoinAndMapOne('itemd.col',DynamicColumn,"col", "itemd.dynamic_id = col.dynamic_id")
      //   .select(['item.item_id', 'item.name'])
      //   .addSelect([
      //     'itemd.item_id',
      //     'itemd.value',
      //     'col.name'
      //   ])
      //   .getRawMany()

      data = this.repo.createQueryBuilder("item")
        .leftJoinAndMapMany('item.item_details', 'item_details', 'ItemDetail', 'ItemDetail.item_id = item.item_id and  ItemDetail.is_deleted = :isDelete', { isDelete: false })
        //  .innerJoinAndSelect(DynamicColumn, "col", "col.dynamic_id = ItemDetail.dynamic_id")
        .innerJoinAndMapOne('ItemDetail.dyn', 'dynamic_column', 'dynamicCol', 'dynamicCol.dynamic_id = ItemDetail.dynamic_id and dynamicCol.is_deleted = :isDelete', { isDelete: false })
        .select(['item.item_id', 'item.name'])
        .addSelect([
          'ItemDetail.value',
          'dynamicCol.name',
        ])
        .getMany();


      // data = await this.repo.createQueryBuilder("item")
      //   .select(
      //     ['item.item_id', 'item.name']
      //   )
      //   .addSelect(subQry => subQry.select([ 'col.name']).from(ItemDetail, 'id')
      //     .innerJoinAndSelect(DynamicColumn, "col", "col.dynamic_id = id.dynamic_id")
      //     .where('id.item_id =item.item_id ')

      //   )
      //   .getRawMany()


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
