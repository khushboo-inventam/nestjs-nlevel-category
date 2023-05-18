import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
// import { Repository } from 'typeorm';
import { Category } from "./entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";

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
    });
    return data;
  }

  async findAll() {
    console.log("this.repo", this.repo);
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

        alias: "cat",

        leftJoinAndSelect: {
          category_parent_category_id_category: "cat.parent_category_id",
        },
      },
      where: {
        parent_category_id: true,
      },
    });
    return data;
  }

  findOne(id: number) {
    return this.repo.findOne({
      relations: { parent_category_id: true },
      where: { category_id: id },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
   // return this.repo.update({...updateCategoryDto},{ where: { category_id: id } });
  }

  remove(id: number) {
 //   return this.repo.update({ where: { category_id: id } });
  }
}
