import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SearchTracksDto } from "../common/SearchTracksDto.dto";
import { MessagePattern } from "@nestjs/microservices";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { AllExceptionsFilter } from "../common/all-exceptions.filter";
import { IResponse } from "src/common/response.interface";

@UseFilters(new AllExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  //@Post()
  @MessagePattern("category_create")
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  //@Get()
  @MessagePattern("category_search_by_name")
  findAll(@Query() params?: SearchTracksDto) {
    console.log("params", params);
    return this.categoryService.findAll(params);
  }

  // @Get(":id") 
  @MessagePattern("category_search_by_category_id")
  async findOne(@Param("id") id: string) {
    const catData = await this.categoryService.findOne(+id);
    let result: IResponse;

    if (!catData && catData !== undefined) {
      result = {
        status: HttpStatus.NOT_FOUND,
        message: 'category_not_found',
        errors: null,
      };

    }
    return catData
  }

  //@Patch(":id")
  @MessagePattern("category_update_category_by_id")
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @MessagePattern("category_delete_by_category_id")
  // @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoryService.remove(+id);
  }
}
