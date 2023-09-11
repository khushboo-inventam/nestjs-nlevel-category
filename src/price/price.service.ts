import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { STRIPE_TOKEN } from 'src/stripe/stripe-options.interface';
import { PLAN, PRICE } from 'src/common/global-constants';
import { unixTimestamp } from 'src/common/pagination';
import { Plan } from 'src/plan/entities/plan.entity';

@Injectable()
export class PriceService {

  constructor(@InjectRepository(Price) private readonly repo: Repository<Price>,
    @InjectRepository(Plan) private readonly planRepo: Repository<Plan>,
    @Inject(STRIPE_TOKEN) private readonly stripeClient: Stripe,
  ) { }

  async create(createPriceDto: CreatePriceDto) {

    const [planExist] = await this.planRepo.find({ where: { is_deleted: false, plan_id: +createPriceDto.plan_id } })
    if (!planExist || planExist === undefined) throw new HttpException(PLAN.NOT_FOUND, HttpStatus.NOT_FOUND);


    const alreadyExist = await this.repo.find({ where: { is_deleted: false, plan_id: +createPriceDto.plan_id, interval: createPriceDto.interval, interval_count: createPriceDto.interval_count } })
    if (alreadyExist && alreadyExist.length > 0) throw new HttpException(PRICE.ALREADY_EXIST_PRICE, HttpStatus.UNPROCESSABLE_ENTITY);
    let data

    try {

      data = await this.repo.save({
        ...createPriceDto,
        is_deleted: false,
        created_at: unixTimestamp().toString()
      });

      //  Stripe data insert and  manipulate  
      if (data && data !== undefined && planExist.stripe_plan_id) {

        const addPriceInStripe = await this.stripeClient.prices.create({
          unit_amount: data.unit_amount,
          currency: data.currency,
          recurring: { interval: data.interval, interval_count: data.interval_count },
          product: planExist.stripe_plan_id,
        })

        if (addPriceInStripe && addPriceInStripe !== undefined && addPriceInStripe?.id && addPriceInStripe?.id !== undefined) {
          let stripeProductId: string = addPriceInStripe.product.toString();
          await this.repo.update({ price_id: data.price_id },
            { stripe_price_id: addPriceInStripe.id, stripe_plan_id: stripeProductId })
        }

      }

    } catch (error) {
      console.log('error ', error
      )
    }
    return data;
  }

  findAll() {
    return this.repo.find({ where: { is_deleted: false } })
  }
  findOne(id: number) {
    return this.repo.findOne({ where: { is_deleted: false } })
  }

  update(id: number, updatePriceDto: UpdatePriceDto) {
    return `This action updates a #${id} price`;
  }

  remove(id: number) {
    return `This action removes a #${id} price`;
  }
}
