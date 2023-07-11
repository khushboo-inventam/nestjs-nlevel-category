import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
// import { categoryProviders } from '. /category.providers';
import { Category } from "./entities/category.entity";
import { APP_FILTER } from "@nestjs/core";
import { History } from "../history/entities/history.entity";
import { HistoryService } from "../history/history.service";
// import { AllExceptionsFilter } from "../common/all-exceptions.filter";

@Module({
  // imports: [DatabaseModule],
  imports: [TypeOrmModule.forFeature([Category]), TypeOrmModule.forFeature([History])],
  controllers: [CategoryController],
  providers: [CategoryService, HistoryService],
})
export class CategoryModule { }
