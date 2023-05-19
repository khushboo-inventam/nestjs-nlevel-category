import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
// import { Repository } from 'typeorm';
import { Category } from "./entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, ILike, Like, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { setPagination, unixTimestamp } from "src/comman/pagination";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let parentId = 0;
    let parentData = [];
    let parentRelation = {};
    if (
      typeof createCategoryDto === "object" &&
      "parent_category_id" in createCategoryDto
    ) {
      parentId = +createCategoryDto.parent_category_id;
      console.log("this.repo", this.repo);
      parentData = await this.repo.find({
        where: { category_id: +createCategoryDto.parent_category_id },
      });
      parentRelation = { parent_category_id: parentData };
    }
    console.log("parentData", parentData);
    const data = await this.repo.save({
      name: createCategoryDto.name,
      ...parentRelation,
      created_at: unixTimestamp().toString(),
    });
    return data;
  }

  async findAll(params) {
    console.log("params.query", params);
    let pagination = setPagination(params);
    let whereCondition = {};
    if (params?.search) {
      Object.assign(whereCondition, { name: ILike(`%${params?.search}%`) });
    }
    console.log("whereCondition", whereCondition);

    //     const QBData = await this.repo.createQueryBuilder("category").
    //     leftJoinAndSelect("category", "subCat", "subCat.category_id = category.parent_category_id")
    //     .getMany()
    const data = await this.repo.find({
      select: {
        name: true,
        category_id: true,
        parent_category_id: true,
      },
      //       relations: {parent_category_id : true}
      join: {
        //         parent_category_id: true,

        alias: "category",

        leftJoinAndSelect: {
          category_parent_category_id_category: "category.parent_category_id",
        },
      },
      where: {
        parent_category_id: true,
        ...whereCondition,
      },
      ...pagination,
    });
    return data;
  }

  findOne(id: number) {
    return this.repo.findOne({
      relations: { parent_category_id: true },
      where: { category_id: id },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    let parentId = 0;
    let parentData = [];
    let parentRelation = {};
    if (
      typeof updateCategoryDto === "object" &&
      "parent_category_id" in updateCategoryDto
    ) {
      parentId = +updateCategoryDto.parent_category_id;
      console.log("this.repo", this.repo);
      parentData = await this.repo.find({
        where: { category_id: +updateCategoryDto.parent_category_id },
      });
      parentRelation = { parent_category_id: parentData };
    }
    return this.repo.update(
      { category_id: id },
      {
        name: updateCategoryDto.name,
        ...parentRelation,
        updated_at: unixTimestamp().toString(),
      }
    );
  }

  remove(id: number) {
    return this.repo.update(
      { category_id: id },
      { is_deleted: true, deleted_at: unixTimestamp().toString() }
    );
  }
}
