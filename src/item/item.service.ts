import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository, } from 'typeorm';
import { Item } from './entities/item.entity';
import { setPagination, unixTimestamp } from '../common/pagination';
import { ItemDetail } from 'src/item-details/entities/item-detail.entity';
import { DynamicColumn } from 'src/dynamic-columns/entities/dynamic-column.entity';

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

      let itemDetailData: any = await this.itemDetail.createQueryBuilder("id")
        .select(['id.item_id', 'id.value', 'col.name as key'])
        .innerJoinAndSelect(DynamicColumn, "col", "col.dynamic_id = id.dynamic_id")
        
      console.log('itemDetailData', itemDetailData)

       retdata = await itemDetailData.leftJoinAndSelect('item', "i", "i.item_id=id.item_id").getRawMany()
      console.log('retdata------>',retdata)
      //.JoinAndSelect(DynamicColumn, "col", "col.dynamic_id = id.dynamic_id")

      // data = await this.repo.createQueryBuilder("item")
      //   .leftJoinAndSelect(ItemDetail, "itemd", "itemd.item_id = item.item_id")
      //   .leftJoinAndSelect(DynamicColumn, "col", "col.dynamic_id = itemd.dynamic_id")
      //   .select(['item.item_id', 'item.name', 'itemd.value', 'col.name as dy_col'])
      //   .getRawMany()
      // data =  await this.repo.createQueryBuilder("item")
     
      // .getRawMany()
    } catch (error) {
      console.log('error', error)
    }


    // console.log('data', data)


    const group = {};
    // Promise.all(

    //   data.map(({ item_name, ...rest }) => {
    //     console.log('   item_name ', item_name)
    //     group[item_name] = group[item_name] || { item_name, details: [] };
    //     console.log('   group[item_name] ', group[item_name])
    //     group[item_name].details.push(rest)
    //     return group
    //   })
    // )
    // data.forEach(({ item_name, ...rest }) => {
    //   group[item_name] = group[item_name] || { item_name, item_data: [] };
    //   group[item_name].item_data.push(rest)
    // })


    console.log(Object.values(group))
    return retdata;
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
