import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateItemDetailDto } from './dto/create-item-detail.dto';
import { UpdateItemDetailDto } from './dto/update-item-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemDetail } from './entities/item-detail.entity';
import { ILike, Repository } from 'typeorm';
import { setPagination, unixTimestamp } from '../common/pagination';
import { ItemService } from '../item/item.service';
import { DynamicColumnsService } from '../dynamic-columns/dynamic-columns.service';
import { Item } from '../item/entities/item.entity';

@Injectable()
export class ItemDetailsService {

  constructor(
    @InjectRepository(ItemDetail) private readonly repo: Repository<ItemDetail>,
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
    @Inject(forwardRef(() => ItemService))
    private itemService: ItemService,
    @Inject(forwardRef(() => DynamicColumnsService))
    private dynamicColumnsService: DynamicColumnsService,
  ) { }

  async create(createItemDetailDto: CreateItemDetailDto) {


    let newData = {}

    if (
      typeof createItemDetailDto === "object" &&
      "dynamic_id" in createItemDetailDto
    ) {
      let dynamicData = await this.dynamicColumnsService.findOne(+createItemDetailDto.dynamic_id);

      // Object.assign(newData, { dynamic_id: dynamicData })
      if(!dynamicData || dynamicData === undefined) 
      throw new HttpException('Dynamic id not found', HttpStatus.NOT_FOUND);
    }

    if (
      typeof createItemDetailDto === "object" &&
      "item_id" in createItemDetailDto
    ) {
      let itemData = await this.itemService.findOne(+createItemDetailDto.item_id);
      if(!itemData || itemData === undefined) 
      throw new HttpException('Item id not found', HttpStatus.NOT_FOUND);
      // Object.assign(newData, { item_id: itemData })
    }
    let data;
    try {

      data = await this.repo.save({
        value: createItemDetailDto.value,
        // ...newData,
        item_id: +createItemDetailDto.item_id,
        dynamic_id: +createItemDetailDto.dynamic_id,
        created_at: unixTimestamp().toString(),
      });
    } catch (error) {
      console.log('error', error)
    }
    return data;
  }

  async findAll(params) {

    const pagination = setPagination(params);
    console.log('pagination', pagination)
    const whereCondition = { 'is_deleted': false };
    if (params?.search) {
      Object.assign(whereCondition, { name: ILike(`%${params?.search}%`) });
    }
    let data;
    try {
      // data = await this.repo.find({
      //   select: {
      //     item_detail_id: true,
      //     value: true,
      //   },

      //   join: {
      //     alias: "itemdetail",
      //     leftJoinAndSelect: {
      //       //dynamic_id: "itemdetail.dynamic_id",
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
      data = await this.repo.createQueryBuilder("itemd")
      // .leftJoinAndSelect(ItemDetail, "item_details", "item_details.item_id = item.item_id")
        .leftJoinAndMapMany('item.itemdetail',Item,"items", "itemd.item_id = items.item_id")
        .select(['itemd.item_detail_id','itemd.value','itemd.item_id'])
        .addSelect(['items.name'])
        .getMany()
    } catch (error) {
      console.log('error', error)
    }

    return data;

  }

  findOne(id: number) {

    return this.repo.findOne({
      where: { is_deleted: false, item_detail_id: id },
    });

  }

  update(id: number, updateItemDetailDto: UpdateItemDetailDto) {
    return `This action updates a #${id} itemDetail`;
  }

  remove(id: number) {

    return this.repo.update(
      { item_detail_id: id },
      { is_deleted: true, deleted_at: unixTimestamp().toString() }
    );
  }
}
