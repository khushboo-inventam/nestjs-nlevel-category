import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { CreateItemDetailDto } from "./dto/create-item-detail.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ItemDetail } from "./entities/item-detail.entity";
import { ILike, Repository } from "typeorm";
import { setPagination, unixTimestamp } from "../common/pagination";
import { ItemService } from "../item/item.service";
import { DynamicColumnsService } from "../dynamic-columns/dynamic-columns.service";
import { Item } from "../item/entities/item.entity";
import { UpdateItemDetail } from "../app.interface";

@Injectable()
export class ItemDetailsService {
  constructor(
    @InjectRepository(ItemDetail) private readonly repo: Repository<ItemDetail>,
    @InjectRepository(Item) private readonly itemRepo: Repository<Item>,
    @Inject(forwardRef(() => ItemService))
    private itemService: ItemService,
    @Inject(forwardRef(() => DynamicColumnsService))
    private dynamicColumnsService: DynamicColumnsService
  ) {}

  async create(createItemDetailDto: CreateItemDetailDto) {
    let newData = {};

    if (
      typeof createItemDetailDto === "object" &&
      "dynamic_id" in createItemDetailDto
    ) {
      let dynamicData = await this.dynamicColumnsService.findOne(
        +createItemDetailDto.dynamic_id
      );

      // Object.assign(newData, { dynamic_id: dynamicData })
      if (!dynamicData || dynamicData === undefined)
        throw new HttpException("Dynamic id not found", HttpStatus.NOT_FOUND);
    }

    if (
      typeof createItemDetailDto === "object" &&
      "item_id" in createItemDetailDto
    ) {
      let itemData = await this.itemService.findOne(
        +createItemDetailDto.item_id
      );
      if (!itemData || itemData === undefined)
        throw new HttpException("Item id not found", HttpStatus.NOT_FOUND);
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
      console.log("error", error);
    }
    return data;
  }

  async findAll(params) {
    let sortColumns = {};
    let searchData = "";

    if (!params?.sort_column) sortColumns = { sort_column: "itemd.created_at" };

    if (params?.search) {
      searchData = "and (itemd.value ilike :value)";
    }

    let pagination = setPagination(Object.assign(params, sortColumns));
    console.log("pagination", pagination);

    let data;
    try {
      data = await this.repo
        .createQueryBuilder("itemd")
        .where(`itemd.is_deleted = :isDeleted ${searchData}`, {
          isDeleted: false,
          value: `%${params?.search}%`,
        })
        // .leftJoinAndSelect(ItemDetail, "item_details", "item_details.item_id = item.item_id")
        .leftJoinAndSelect(
          "item",
          "items",
          "itemd.item_id = items.item_id  and  items.is_deleted = false "
        )
        .leftJoinAndSelect(
          "dynamic_column",
          "dcol",
          "itemd.dynamic_id = dcol.dynamic_id and  items.is_deleted = false "
        )
        .select(["itemd.item_detail_id", "itemd.value", "itemd.created_at"])

        .addSelect([
          "items.item_id",
          "items.name",
          "dcol.dynamic_id",
          "dcol.name",
        ])
        .take(pagination.take)
        .skip(pagination.skip)
        .orderBy(pagination.order)
        .getRawMany();
    } catch (error) {
      console.log("error", error);
    }
    console.log("dataaa", data);
    return data;
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { is_deleted: false, item_detail_id: id },
    });
  }

  update(id: number, updateItemDetailObj: UpdateItemDetail) {
    return this.repo.save({
      item_detail_id: id,
      ...updateItemDetailObj,
      updated_at: unixTimestamp().toString(),
    });
  }

  remove(id: number) {
    return this.repo.update(
      { item_detail_id: id },
      { is_deleted: true, deleted_at: unixTimestamp().toString() }
    );
  }
}
