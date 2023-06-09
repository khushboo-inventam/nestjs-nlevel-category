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
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SearchTracksDto } from "../common/SearchTracksDto.dto";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { IResponse } from "../common/response.interface";
import { AllExceptionsFilter } from "src/common/all-exceptions.filter";

@UseFilters(new AllExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  // @MessagePattern("category_create")
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  // @MessagePattern("category_search_by_name")
  findAll(@Query() params?: SearchTracksDto) {
    console.log("params", params);
    return this.categoryService.findAll(params);
  }

  @Get(":id")
  // @MessagePattern("category_search_by_category_id")
  async findOne(@Param("id") id: string) {
    const catData = await this.categoryService.findOne(+id);
    let result: IResponse;

    if (!catData || catData !== undefined) {
      throw new HttpException('Dynamic id not found', HttpStatus.NOT_FOUND);

    }
    return catData
  }

  @Patch(":id")
  // @MessagePattern("category_update_category_by_id")
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  // @MessagePattern("category_delete_by_category_id")
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoryService.remove(+id);
  }
}
