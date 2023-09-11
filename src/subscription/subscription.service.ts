import { Inject, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Repository } from 'typeorm';
import { Price } from 'src/price/entities/price.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { STRIPE_TOKEN } from 'src/stripe/stripe-options.interface';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService {


  constructor(@InjectRepository(Price) private readonly priceRepo: Repository<Price>,
    @InjectRepository(Plan) private readonly planRepo: Repository<Plan>,
    @InjectRepository(Subscription) private readonly subscriptionRepo: Repository<Subscription>,
    @Inject(STRIPE_TOKEN) private readonly stripeClient: Stripe,
  ) { }

  async create(createSubscriptionDto: CreateSubscriptionDto, request) {

    /// check customer is exist or not 
    let customerId :string  ='cus_NEAAB4tK516HQT';


    const [planDtoData] = await this.planRepo.find({
      where: {
        is_deleted: false,
        plan_id: createSubscriptionDto.plan_id
      }
    })
    const [priceDtoData] = await this.priceRepo.find({
      where: {
        is_deleted: false,
        price_id: createSubscriptionDto.price_id
      }
    })

    const checkUserSubscription = await this.subscriptionRepo.findOne(
      {
        where: {
          is_deleted: false,
          user_id: request.user?.userId
        }
      })

    // if customer has no  subscription then give him 
    if (!checkUserSubscription || checkUserSubscription === undefined) {
      const giveFristLocalSubscription = await this.subscriptionRepo.create({
        ...createSubscriptionDto,
        created_by: request.user.userId
      })


      if (giveFristLocalSubscription && giveFristLocalSubscription !== undefined) {

        const giveFristStripeSubscription = await this.stripeClient.subscriptions.create({
          customer: customerId,
          items: [
            {price: priceDtoData.stripe_price_id },
          ],
        })
      }
    }
    const planDetail = await this.priceRepo.findOne({})



  }


  //upword
  //downgradePlan

  findAll() {
    return `This action returns all subscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
