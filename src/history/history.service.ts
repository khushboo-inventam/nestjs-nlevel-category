import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { History } from "./entities/history.entity";
import { ILike, Repository } from "typeorm";
import { IResponse } from "../common/response.interface";
import { setPagination, unixTimestamp } from "../common/pagination";

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History) private readonly repo: Repository<History>
  ) {}

  async create(createHistory) {
    let result: IResponse;
    const historyResult = await this.repo.save({
      ...createHistory,
    });

    console.log("historyResult", historyResult);
    return historyResult;
  }

  async findOne(id: number) {
    return await this.repo.find({
      where: { id },
    });
  }

  async findAll(params) {
    const pagination = setPagination(params);
    console.log("pagination", pagination);

    const whereCondition = {};
    let searchData = "";

    if (params?.search) {
      searchData = "history.module ilike :name or history.action ilike :name";
    }

    let data;
    console.log(`%${params?.search}%`);
    try {
      data = await this.repo
        .createQueryBuilder("history")
        .where(`${searchData}`, { name:`%${params?.search}%` })
        // .select(['history.id', 'history.user_id','history.module', 'history.action', 'history.before', 'history.after', 'history.action_at' ])
        .take(pagination.take)
        .skip(pagination.skip)
        .orderBy(pagination.order)
        .getMany();

      return data;
    } catch (err) {
      console.log("error", err);
    }
  }
}
