import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { unixTimestamp } from 'src/common/pagination';
import Stripe from 'stripe';
import { STRIPE_TOKEN } from 'src/stripe/stripe-options.interface';
import { PLAN, PRICE } from 'src/common/global-constants';
import { Price } from 'src/price/entities/price.entity';

@Injectable()
export class PlanService {

  constructor(@InjectRepository(Plan) private readonly repo: Repository<Plan>,
  @InjectRepository(Price) private readonly priceRepo: Repository<Price>,
    @Inject(STRIPE_TOKEN) private readonly stripeClient: Stripe,
  ) { }

  async create(createPlanDto: CreatePlanDto) {
    const alreadyExist = await this.repo.find({ where: { is_deleted: false, name: createPlanDto.name } })
    console.log('alreadyExist', alreadyExist)
    if (alreadyExist && alreadyExist.length > 0) throw new HttpException(PLAN.ALREADY_EXIST_PLAN, HttpStatus.UNPROCESSABLE_ENTITY);
    let data
    try {

      data = await this.repo.save({
        ...createPlanDto,
        is_deleted: false,
        created_at: unixTimestamp().toString(),
      });

      if (data && data !== undefined) {
        // const alreadyExistInStripe  = await this.stripeClient.products.search({ query: `name:'${data.name}'` })

        const addPlanInStripe = await this.stripeClient.products.create({
          name: data.name
        })

        if (addPlanInStripe && addPlanInStripe !== undefined && addPlanInStripe?.id && addPlanInStripe?.id !== undefined) {
          // let stripeProductId: string = addPlanInStripe.id.toString();
          await this.repo.update({ plan_id: data.plan_id },
            { stripe_plan_id: addPlanInStripe.id })
        }
      }

    } catch (error) {
      console.log('error ', error
      )
    }
    return data;
  }

  findAll() {
    return this.repo
      .createQueryBuilder("plan")
      .leftJoinAndMapMany(
        "plan.plan_id",
        "price",
        "price",
        "price.plan_id = plan.plan_id and plan.is_deleted = :isDelete",
        { isDelete: false }
      )
      .where("price.is_deleted = :isDeleted ", { isDeleted: false })
      .getMany();
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

  async findOnePrice(where) {
    const priceData = await this.priceRepo.findOne(where);
    if (!priceData || priceData === undefined) throw new HttpException(PRICE.NOT_FOUND, HttpStatus.NOT_FOUND);
    const planData = await this.repo.findOne({where :{ stripe_plan_id: priceData.STRIPE, is_deleted: false, active: true }});
    priceData.plan_name = planData.name;
    priceData.plan_descriptions = planData.description;
    priceData.images = planData.images;
    priceData.metadata = planData.metadata;
    
    return priceData;
  }

  async getPlanNameByPrice(where) {
    const priceData = await this.priceRepo.findOne(where);
    if (!priceData || priceData === undefined) throw new HttpException(PRICE.NOT_FOUND, HttpStatus.NOT_FOUND);
    const planData = await this.repo.findOne({where:{ stripe_plan_id: priceData.stripe_plan_id, is_deleted: false, active: true }});
    return { plan_name: planData.name, plan_duration: `${priceData.interval_count}-${priceData.interval}` };
  }

   

}
