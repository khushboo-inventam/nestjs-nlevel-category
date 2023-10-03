import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Price } from 'src/price/entities/price.entity';

@Module({
  imports:  [TypeOrmModule.forFeature([Plan]), TypeOrmModule.forFeature([Price])],
  controllers: [PlanController],
  providers: [PlanService]
})
export class PlanModule {}
