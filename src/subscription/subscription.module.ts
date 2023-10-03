import { Module, forwardRef } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { Plan } from 'src/plan/entities/plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from 'src/price/entities/price.entity';
import { Subscription } from './entities/subscription.entity';
import { PaymentMethod } from 'src/payment-methods/entities/payment-method.entity';
import { PlanService } from 'src/plan/plan.service';
import { PriceService } from 'src/price/price.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Plan]), TypeOrmModule.forFeature([Price]), TypeOrmModule.forFeature([Subscription]),
  TypeOrmModule.forFeature([PaymentMethod]), TypeOrmModule.forFeature([User])
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService,PlanService,PriceService, UsersService ]
})
export class SubscriptionModule { }
