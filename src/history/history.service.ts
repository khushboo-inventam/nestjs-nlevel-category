import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './entities/history.entity';
import { Repository } from 'typeorm';
import { IResponse } from '../common/response.interface';
import { unixTimestamp } from '../common/pagination';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(History) private readonly repo: Repository<History>
      ) { }

      async create(createHistory) {
        let result: IResponse;
        const historyResult = await this.repo.save({
          ...createHistory,
        });

        console.log("historyResult", historyResult);
        return historyResult;
      }
}
