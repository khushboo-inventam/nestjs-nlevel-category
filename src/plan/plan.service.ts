import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { unixTimestamp } from 'src/common/pagination';
import Stripe from 'stripe';
import { STRIPE_TOKEN } from 'src/stripe/stripe-options.interface';
import { PLAN } from 'src/common/global-constants';

@Injectable()
export class PlanService {

  constructor(@InjectRepository(Plan) private readonly repo: Repository<Plan>,
    @Inject(STRIPE_TOKEN) private readonly stripeClient: Stripe,
  ) { }

  async create(createPlanDto: CreatePlanDto) {
    const alreadyExist = await this.repo.find({ where: { is_deleted: false, name: createPlanDto.name } })
    if  (alreadyExist )throw new HttpException(PLAN.ALREADY_EXIST_PLAN, HttpStatus.UNPROCESSABLE_ENTITY);
    let data
    try {

      data = await this.repo.save({
        ...createPlanDto,
        is_deleted: false,
        created_at: unixTimestamp().toString(),
      });

      if (data && data !== undefined) {
        // const alreadyExistInStripe  = await this.stripeClient.products.search({ query: `name:'${data.name}'` })

        await this.stripeClient.products.create({
          name: data.name
        })
      }

    } catch (error) {
      console.log('error ', error
      )
    }
    return data;
  }

  findAll() {
    return `This action returns all plan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
