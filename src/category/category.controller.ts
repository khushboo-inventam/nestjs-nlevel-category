import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseFilters,
  ValidationPipe,
  UsePipes,
  HttpException,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SearchTracksDto } from "../common/SearchTracksDto.dto";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { IResponse } from "../common/response.interface";
import { AllExceptionsFilter } from "../common/all-exceptions.filter";
import { CATEGORY } from "../common/global-constants";
import { MessageResponse } from "../common/message.dto";
import { MessagePattern } from "@nestjs/microservices";

@UseFilters(new AllExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  // @Post()
   @MessagePattern("category_create")
  async create(createCategoryDto: CreateCategoryDto) {
    console.log("createCategoryDto", createCategoryDto);
    const createData = await this.categoryService.create(createCategoryDto);
    return {
      data: createData,
      message: CATEGORY.CREATED
    }
  }

  // @Get()
   @MessagePattern("category_search_by_name")
  async findAll(params?: SearchTracksDto) {
    const findAllData = await this.categoryService.findAll(params);
    return {
      data: findAllData,
      message: findAllData && findAllData !== undefined && findAllData.length > 0 ? CATEGORY.FETCHED : CATEGORY.NOT_FOUND
    }
  }

  // @Get(":id")
   @MessagePattern("category_search_by_category_id")
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    const catData = await this.categoryService.findOne(+id);
    let result: IResponse;

    if (catData.length === 0) {
      throw new HttpException(CATEGORY.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return {
      data: catData,
      message: CATEGORY.FETCHED
    }
  }

  //  @Patch(":id")
  @MessagePattern("category_update_category_by_id")
  async update(
    updateCategoryDto: UpdateCategoryDto
  ) {
    const { category_id, ...updateObj} = updateCategoryDto;
    // const catData = await this.categoryService.findOne(+id)
    // if (!catData || catData !== undefined) {
    //   throw new HttpException(CATEGORY.NOT_FOUND, HttpStatus.NOT_FOUND);
    // }
    const updateCatData = await this.categoryService.update(+category_id, updateObj);
    return {
      data: updateCatData,
      message: CATEGORY.UPDATED
    }
  }

  @MessagePattern("category_delete_by_category_id")
  // @Delete(":id")
  async remove(id: string): Promise<MessageResponse> {
    await this.categoryService.remove(+id);

    return {
      message: CATEGORY.DELETED
    }
  }
}
