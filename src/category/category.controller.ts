import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ApiTags } from "@nestjs/swagger";
import { SearchTracksDto } from "src/comman/SearchTracksDto.dto";
import { MessagePattern } from "@nestjs/microservices";

@ApiTags("category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

 // @Post()
   @MessagePattern('category_create')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

//   @Get()
@MessagePattern('category_search_by_name')
  findAll(@Query() params?: SearchTracksDto) {
    console.log("params", params);
    return this.categoryService.findAll(params);
  }

//   @Get(":id")
  @MessagePattern('category_search_by_category_id')
  findOne(@Param("id") id: string) {
    return this.categoryService.findOne(+id);
  }

//   @Patch(":id")
@MessagePattern('task_update_category_by_id')
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }
   @MessagePattern('task_delete_by_category_id')
//   @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoryService.remove(+id);
  }
}
