import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { Plan } from 'src/plan/entities/plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from 'src/price/entities/price.entity';
import { Subscription } from './entities/subscription.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Plan]), TypeOrmModule.forFeature([Price]), TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService]
})
export class SubscriptionModule { }
