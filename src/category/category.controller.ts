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
import { unixTimestamp } from "../common/pagination";
import { HistoryService } from "../history/history.service";

@UseFilters(new AllExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService, private readonly historyService: HistoryService) { }

  @Post()
  //  @MessagePattern("category_create")
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    console.log("createCategoryDto", createCategoryDto);
    const createData = await this.categoryService.create(createCategoryDto);
    console.log("createData", createData);

    //This is to create history of create category
    // const createCategoryHistoryObj = {
    //   module: "Category",
    //   user_id: 1,
    //   action: "Create Category",
    //   before: {},
    //   after: JSON.stringify(createData),
    //   action_at: unixTimestamp().toString()
    // }

    // await this.historyService.create(createCategoryHistoryObj);

    return {
      data: createData,
      message: CATEGORY.CREATED
    }
  }

  @Get()
  // @MessagePattern("category_search_by_name")
  async findAll(@Query() params?: SearchTracksDto) {
    const findAllData = await this.categoryService.findAll(params);
    console.log("findAllData", findAllData);

    //This is to create history of view category
    // const viewCategoryHistoryObj = {
    //   module: "Category",
    //   user_id: 1,
    //   action: "Find All Category",
    //   before: {},
    //   after: JSON.stringify(findAllData),
    //   action_at: unixTimestamp().toString()
    // }

    // await this.historyService.create(viewCategoryHistoryObj);

    return {
      data: findAllData,
      message: findAllData && findAllData !== undefined && findAllData.length > 0 ? CATEGORY.FETCHED : CATEGORY.NOT_FOUND
    }
  }

  @Get(":id")
  //  @MessagePattern("category_search_by_category_id")
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string) {
    const catData = await this.categoryService.findOne(+id);

    if (catData.length === 0) {
      throw new HttpException(CATEGORY.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    //This is to create history of view specific category
    // const viewSpecificCategoryHistoryObj = {
    //   module: "Category",
    //   user_id: 1,
    //   action: "Find Specific Category",
    //   before: {},
    //   after: JSON.stringify(catData),
    //   action_at: unixTimestamp().toString()
    // }

    // await this.historyService.create(viewSpecificCategoryHistoryObj);

    return {
      data: catData,
      message: CATEGORY.FETCHED
    }
  }

   @Patch(":id")
  // @MessagePattern("category_update_category_by_id")
  async update(
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    const { category_id, ...updateObj} = updateCategoryDto;
    // const catData = await this.categoryService.findOne(+id)
    // if (!catData || catData !== undefined) {
    //   throw new HttpException(CATEGORY.NOT_FOUND, HttpStatus.NOT_FOUND);
    // }

    const catData = await this.categoryService.findOne(+category_id);

    if (catData.length === 0) {
      throw new HttpException(CATEGORY.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const updateCatData = await this.categoryService.update(+category_id, updateObj);

    //This is to create history of update category
    // const updateSpecificCategoryHistoryObj = {
    //   module: "Category",
    //   user_id: 1,
    //   action: "Update Category",
    //   before: JSON.stringify(catData),
    //   after: JSON.stringify(updateCatData),
    //   action_at: unixTimestamp().toString()
    // }

    // await this.historyService.create(updateSpecificCategoryHistoryObj);

    return {
      data: updateCatData,
      message: CATEGORY.UPDATED
    }
  }

  // @MessagePattern("category_delete_by_category_id")
  @Delete(":id")
  async remove(@Param('id') id: string) {

    const catData = await this.categoryService.findOne(+id);

    if (catData.length === 0) {
      throw new HttpException(CATEGORY.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const data = await this.categoryService.remove(+id);
    console.log("removedData", data)

    //This is to create history of delete category
    // const deleteSpecificCategoryHistoryObj = {
    //   module: "Category",
    //   user_id: 1,
    //   action: "Update Category",
    //   before: JSON.stringify(catData),
    //   after: {},
    //   action_at: unixTimestamp().toString()
    // }

    // await this.historyService.create(deleteSpecificCategoryHistoryObj);

    return {
      data,
      message: CATEGORY.DELETED
    }
  }
}
