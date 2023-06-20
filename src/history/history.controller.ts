import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { HistoryService } from "./history.service";
import { unixTimestamp } from "../common/pagination";
import { CreateHistoryDto } from "./dto/create-history.dto";
import { HISTORY } from "../common/global-constants";
import { SearchTracksDto } from "../common/SearchTracksDto.dto";

@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  //  @MessagePattern("category_create")
  async create(@Body() createHistoryDto: CreateHistoryDto) {
    console.log("createHistoryDto", createHistoryDto);

    const { user_id, module, action } = createHistoryDto;

    const before = {};

    const after = {
      name: "Eighth category",
      parent_category_id: 1,
      created_at: "1687171309",
      created_by: null,
      updated_by: null,
      deleted_by: null,
      updated_at: null,
      deleted_at: null,
      category_id: 59,
      is_deleted: false,
    };

    //This is to create history
    const createHistoryObj = {
      module,
      user_id,
      action,
      before,
      after: JSON.stringify(after),
      action_at: unixTimestamp().toString(),
    };

    const data = await this.historyService.create(createHistoryObj);

    return {
      message: HISTORY.FETCHED,
      data,
    };
  }

  @Get(":id")
  //  @MessagePattern("category_search_by_category_id")
  async findOne(
    @Param(
      "id",
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
    )
    id: string
  ) {
    const historyData = await this.historyService.findOne(+id);

    if (historyData.length === 0) {
      throw new HttpException(HISTORY.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      data: historyData,
      message: HISTORY.FETCHED,
    };
  }

  @Get()
  // @MessagePattern("category_search_by_name")
  async findAll(@Query() params?: SearchTracksDto) {
    const findAllData = await this.historyService.findAll(params);
    console.log("findAllData", findAllData);

    return {
      data: findAllData,
      message: findAllData && findAllData !== undefined && findAllData.length > 0 ? HISTORY.FETCHED : HISTORY.NOT_FOUND
    }
  }
}
