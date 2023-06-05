import { HttpStatus, Injectable } from "@nestjs/common";
// import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
// import { InjectDataSource } from "@nestjs/typeorm";
import { setPagination, unixTimestamp } from "../common/pagination";
import { Category } from "./entities/category.entity";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { IResponse } from "src/common/response.interface";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    let result: IResponse;
    if (createCategoryDto.parent_category_id > 0) {
      const parentExist = await this.findOne(+createCategoryDto.parent_category_id)
      if (!parentExist && parentExist !== undefined) {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: 'parent_id_not_found',
          errors: null,
        };
      }
    }

    const data = await this.repo.save({
      ...createCategoryDto,
      created_at: unixTimestamp().toString(),
    });
    return data;
  }

  async findAll(params) {
    let data = await this.repo.createQueryBuilder("category")
      .leftJoinAndSelect(Category, "pCat", "pCat.parent_category_id = category.category_id")
      .getRawMany()
    return data;
  }

  findOne(id: number) {
    return this.repo.findOne({

      where: { category_id: id },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {

    return this.repo.update(
      { category_id: id },
      {
        ...updateCategoryDto,
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
