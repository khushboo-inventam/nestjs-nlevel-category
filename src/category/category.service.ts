import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
// import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
// import { InjectDataSource } from "@nestjs/typeorm";
import { setPagination, unixTimestamp } from "../common/pagination";
import { Category } from "./entities/category.entity";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { IResponse } from "../common/response.interface";
import { CATEGORY } from "../common/global-constants";
import { UpdateCategory } from "../app.interface";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly repo: Repository<Category>
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    let result: IResponse;
    if (createCategoryDto.parent_category_id > 0) {
      const parentExist = await this.findOne(
        +createCategoryDto.parent_category_id
      );
      if (!parentExist && parentExist !== undefined) {
        result = {
          status: HttpStatus.NOT_FOUND,
          message: "parent_id_not_found",
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
    console.log("inside findAll");

    let sortColumns = {};
    let searchData = ""
    if (!params?.sort_column) sortColumns = { sort_column: 'cat.created_at' }
    if (params?.search) {
      searchData = "and ( cat.name ilike :name or pCat.name ilike :name)"
    }
    let pagination = setPagination(Object.assign(params, sortColumns));
    console.log("pagination", pagination);

    let data = await this.repo
      .createQueryBuilder("cat")
      .leftJoinAndMapMany(
        "cat.p_details",
        "category",
        "pCat",
        "pCat.parent_category_id = cat.category_id and pCat.is_deleted = :isDelete",
        { isDelete: false }
      )
      //  .leftJoinAndSelect(Category, "pCat", "pCat.parent_category_id = cat.category_id")
      .select(["cat.category_id", "cat.name", "cat.parent_category_id", "cat.created_at"])
      .addSelect(["pCat.category_id", "pCat.name"])
      .where(` cat.is_deleted = :isDeleted and  cat.parent_category_id = :id ${searchData}`, { id: 0, name: `%${params?.search}%`, isDeleted: false  })

      //.orderBy(pagination.order)
      .take(pagination.take)
      .skip(pagination.skip)
      .orderBy(pagination.order)
      .getMany()

      ;
    console.log("dataaaa", data);  
    return data;
  }

  async findOne(id) {

    const isParentId = await this.repo.findOne({ where: { parent_category_id: id, is_deleted: false } });

    if (isParentId !== undefined && isParentId !== null) {
      return this.repo
        .createQueryBuilder("cat")
        .leftJoinAndMapMany(
          "cat.p_details",
          "category",
          "pCat",
          "pCat.parent_category_id = cat.category_id and pCat.is_deleted = :isDelete",
          { isDelete: false }
        ).select(["cat.category_id", "cat.name", "cat.parent_category_id"])
        .addSelect(["pCat.category_id", "pCat.name"])
        .where("cat.parent_category_id = :parentId and cat.category_id = :id and cat.is_deleted = :isDeleted ", { parentId: 0, id, isDeleted: false })
        .getMany();
    }
    return this.repo.find({ where: { category_id: id, is_deleted: false } })
  }

  async update(id: number, updateCategory: UpdateCategory) {
    return this.repo.save(
      {
        category_id: id,
        ...updateCategory,
        updated_at: unixTimestamp().toString(),
      }
    );
  }

  async remove(id: number) {
    const isParentId = await this.repo.find({ where: { parent_category_id: id } });
    if (isParentId.length !== 0) {
      throw new HttpException(CATEGORY.NOT_DELETE_PARENT_CATEGORY, HttpStatus.BAD_REQUEST);
    }
    await this.repo.update(
      { category_id: id },
      { is_deleted: true, deleted_at: unixTimestamp().toString() }
    );

    const data = await this.repo.findOne({ where: { category_id: id } })

    return data;
  }
}
