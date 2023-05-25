import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateItemDetailDto } from './dto/create-item-detail.dto';
import { UpdateItemDetailDto } from './dto/update-item-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemDetail } from './entities/item-detail.entity';
import { Repository } from 'typeorm';
import { unixTimestamp } from 'src/common/pagination';
import { ItemService } from 'src/item/item.service';
import { DynamicColumnsService } from 'src/dynamic-columns/dynamic-columns.service';

@Injectable()
export class ItemDetailsService {

  constructor(
    @InjectRepository(ItemDetail) private readonly repo: Repository<ItemDetail>,
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

      Object.assign(newData, { dynamic_id: dynamicData })
    }

    if (
      typeof createItemDetailDto === "object" &&
      "item_id" in createItemDetailDto
    ) {
      let itemData = await this.itemService.findOne(+createItemDetailDto.item_id);

      Object.assign(newData, { item_id: itemData })
    }

    const data = await this.repo.save({
      value: createItemDetailDto.value,
      ...newData,
      created_at: unixTimestamp().toString(),
    });
    return data;
  }

  findAll() {
    return `This action returns all itemDetails`;
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
