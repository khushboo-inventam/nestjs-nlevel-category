import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { PlanService } from 'src/plan/plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([Price]), TypeOrmModule.forFeature([Plan])],
  controllers: [PriceController],
  providers: [PriceService, PlanService]
})
export class PriceModule { }
