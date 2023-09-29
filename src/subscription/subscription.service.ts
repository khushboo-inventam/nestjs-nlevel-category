import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
// import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Repository } from 'typeorm';
import { Price } from 'src/price/entities/price.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { STRIPE_TOKEN } from 'src/stripe/stripe-options.interface';
import { Subscription } from './entities/subscription.entity';
import { PaymentMethod } from './../payment-methods/entities/payment-method.entity';
import { PROMOCODE } from 'src/common/global-constants';
import { IGetStripeSubcription } from './interface/stripe-get-subscription';

@Injectable()
export class SubscriptionService {


  constructor(@InjectRepository(Price) private readonly priceRepo: Repository<Price>,
    @InjectRepository(Plan) private readonly planRepo: Repository<Plan>,
    @InjectRepository(Subscription) private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(PaymentMethod) private readonly paymentMethodRepo: Repository<PaymentMethod>,
    @Inject(STRIPE_TOKEN) private readonly stripeClient: Stripe,
  ) { }

  async create(createSubscriptionDto: CreateSubscriptionDto, request) {


    let dataUser = {
      email: 'shailee@inventam.com',
      name: 'shailee'
    }

    let customerId: string = '';
    if (!customerId || customerId === undefined) {
      const stripUserExist = await this.stripeClient.customers.list({
        email: dataUser.email,
        limit: 1,
      });
      if (!stripUserExist?.data?.length) {
        const stripUser = await this.stripeClient.customers.create({
          name: dataUser.name,
          email: dataUser.email,
          description: 'demo User',
        });
        customerId = stripUser.id;
      } else {
        const stripUser = stripUserExist.data[0];
        customerId = stripUser.id;
      }

    }

    const planDtoData = await this.planRepo.findOne({
      where: {
        is_deleted: false,
        plan_id: createSubscriptionDto.plan_id
      }
    })
    const priceDtoData = await this.priceRepo.findOne({
      where: {
        is_deleted: false,
        price_id: createSubscriptionDto.price_id
      }
    })
    let trialEnd;
    let trialPlanPrice;

    const currentSubscription = await this.subscriptionRepo.findOne(
      {
        where: {
          is_deleted: false,
          //    user_id: request.user?.userId
          customer: customerId
        }
      })


    const currentStripSubscription = await this.stripeClient.subscriptions.list({ customer: customerId })
    if (typeof createSubscriptionDto === 'object' && 'payment_method_id' in createSubscriptionDto) {
      const paymentDetails = await this.paymentMethodRepo.findOne({
        where: {
          is_deleted: false,
          user_id: request.user.userId,
          payment_method_id: createSubscriptionDto.payment_method_id,
        }
      });
      if (paymentDetails && paymentDetails !== undefined) {
        await this.stripeClient.paymentMethods.attach(paymentDetails.stripe_payment_method_id, {
          customer: currentSubscription.customer,
        });
        await this.stripeClient.subscriptions.update(currentSubscription.stripe_subscription_id, {
          default_payment_method: paymentDetails.stripe_payment_method_id,
          off_session: true,
        });
      }
    }
    // if customer has no  subscription then give him 
    if (!currentSubscription || currentSubscription === undefined) {
      let giveFristLocalSubscription;
      try {

        giveFristLocalSubscription = await this.subscriptionRepo.save({
          ...createSubscriptionDto,
          customer: customerId,
          user_id: 1,
          created_at: 'f'
        })
      } catch (error) {
        console.log('r', error)
      }


      if (giveFristLocalSubscription && giveFristLocalSubscription !== undefined) {

        const stripSubscription = await this.stripeClient.subscriptions.create({
          customer: customerId,
          items: [
            { price: priceDtoData.stripe_price_id },
          ],
        })

        // if (stripSubscription && stripSubscription !== undefined) {
        //   await this.subscriptionRepo.update({
        //     customer: customerId, is_deleted: false
        //   }, {


        //   })
        // }
      }
    }



    const currentPlanData = await this.planRepo.findOne({
      where: {
        is_deleted: false,
        plan_id: currentSubscription.plan_id
      }
    })

    const currentPriceData = await this.priceRepo.findOne({
      where: {
        is_deleted: false,
        price_id: currentSubscription.price_id
      }
    })


    // if (currentPriceData.unit_amount >= priceDtoData.unit_amount) {
    //   // downgarde plan 
    //   return this.downgradePlan({
    //     currentSubscription,

    //   }, request)

    // }
    return this.changePlan({
      subscription: currentStripSubscription,
      newPlan: {
        stripe_price_id: priceDtoData.stripe_price_id,
        stripe_plan_id: priceDtoData.stripe_plan_id,
        plan_id: planDtoData.plan_id,
        price_id: priceDtoData.price_id,
        change_plan_name: planDtoData.name,
        amount: priceDtoData.unit_amount,
        period_count: priceDtoData.interval_count,
        period: priceDtoData.interval,
      },
      // promotion_code: promotionCode,
      trialEnd,
      trialPlanPrice : priceDtoData.stripe_price_id
    })

  }

  async downgradePlan(changeSubscriptionDto, request) {
    const {
      subscription,
      new_stripe_price_id,
      new_stripe_plan_id,
      current_stripe_price_id,
      promotion_code: promotionCode,
      trialEnd,
    } = changeSubscriptionDto;
    const prorationDate = Math.floor(Date.now() / 1000) + 30;
    let cancelAtPeriodEnd;

    let couponCode = {};
    if (promotionCode && promotionCode !== undefined) {
      const couponDto = {
        new_stripe_plan_id,
        promo_code: promotionCode,
      };
      const promoCodeData = await this.couponApplyOnProduct(couponDto);
      couponCode = promoCodeData.coupon_code;
      couponCode = { coupon: couponCode || couponCode !== undefined ? couponCode : null };
    }

    if (
      typeof changeSubscriptionDto === 'object' &&
      'cancel_at_period_end' in changeSubscriptionDto &&
      changeSubscriptionDto.cancel_at_period_end !== undefined
    ) {
      // eslint-disable-next-line prefer-const
      cancelAtPeriodEnd = changeSubscriptionDto.cancel_at_period_end;
    } else {
      cancelAtPeriodEnd = true;
    }

    let scheduleID = subscription.schedule;

    let schedule = await this.stripeClient.subscriptionSchedules.create({
      from_subscription: subscription.stripe_subscription_id,
    });
    scheduleID = schedule.id;

    schedule = await this.stripeClient.subscriptionSchedules.update(scheduleID, {
      end_behavior: 'release',
      phases: [
        {
          start_date: subscription.current_period_start,
          end_date: cancelAtPeriodEnd ? subscription.current_period_end : prorationDate,
          // end_date: testDate,
          ...trialEnd,
          items: [{ price: current_stripe_price_id, quantity: 1 }],
        },
        {
          start_date: cancelAtPeriodEnd ? subscription.current_period_end : prorationDate,
          items: [{ price: new_stripe_price_id, quantity: 1 }],
          collection_method: 'charge_automatically',
          default_payment_method: subscription.default_payment_method,
          billing_cycle_anchor: 'phase_start',
          ...couponCode,
        },
      ],
      proration_behavior: 'create_prorations',
    });


    const updatedSub = await this.subscriptionRepo.findOne({ where: { user_id: request.user.userId } });
    return schedule;
  }

  async changePlan(changeSubscriptionDto) {
    const {
      subscription,
      newPlan,
      promotion_code: promotionCode,
      trialEnd,
      trialPlanPrice,
    } = changeSubscriptionDto;

    let promoCode;

    if (promotionCode || promotionCode !== undefined) {
      const couponDto = {
        new_stripe_plan_id: newPlan.stripe_plan_id,
        promo_code: promotionCode,
      };
      const couponCode = await this.couponApplyOnProduct(couponDto);
      // eslint-disable-next-line prefer-const
      promoCode = {
        promotion_code: couponCode.promo_code && couponCode.promo_code !== undefined ? couponCode.promo_code : null,
      };
    }
    // Check the product is applicable for particular promocode .
    const prorationDate = Math.floor(Date.now() / 1000);
    console.log('subscription', subscription)
    const stripeSubscription = subscription.data[0]
    let updatedSub = await this.stripeClient.subscriptions.update(stripeSubscription.id, {
      off_session: true,
      items: [{ id: stripeSubscription.items.data[0].id, price: trialPlanPrice }],
      ...trialEnd,
    });


    return updatedSub;
  }


  async couponApplyOnProduct(promoCodeDto) {
    let promoCode = null;
    const promoCodeData: any = await this.stripeClient.promotionCodes.list({
      code: promoCodeDto.promo_code,
      active: true,
    });
    if (!promoCodeData || promoCodeData === undefined || promoCodeData.data.length === 0)
      throw new HttpException(PROMOCODE.INVALID, HttpStatus.BAD_REQUEST);

    const couponData = {
      new_stripe_plan_id: promoCodeDto.new_stripe_plan_id,
      promotion_code: promoCodeDto.promo_code,
      coupon_id: promoCodeData.data[0].coupon.id,
    };

    const couponOnProduct = await this.stripeClient.coupons.retrieve(couponData.coupon_id, {
      expand: ['applies_to'],
    });
    if (
      !couponOnProduct ||
      couponOnProduct === undefined ||
      !(typeof couponOnProduct === 'object' && 'applies_to' in couponOnProduct)
    )
      throw new HttpException(PROMOCODE.NOT_APPLICABLE, HttpStatus.FORBIDDEN);

    const couponProduct: any = couponOnProduct.applies_to.products;

    if (!couponProduct.includes(promoCodeDto.new_stripe_plan_id))
      throw new HttpException(PROMOCODE.NOT_APPLICABLE_ON_PRODUCT, HttpStatus.FORBIDDEN);
    promoCode = promoCodeData.data[0].id;

    return { promo_code: promoCode, coupon_code: couponData.coupon_id };
  }



  findAll() {
    return `This action returns all subscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  async update() {

    let customerId = 'cus_Oi0Cdt3UDLAvow'
    const subData = (await this.stripeClient.subscriptions.list({ customer: customerId })).data[0]

    let changeData: IGetStripeSubcription

    await this.subscriptionRepo.update({
      customer: customerId, is_deleted: false
    }, {

      billing_cycle_anchor: subData.billing_cycle_anchor,
      cancel_at: subData.cancel_at,
      cancel_at_period_end: subData.cancel_at_period_end,
      // canceled_at : subData.canceled_at,
      created: subData.created,
      currency: subData.currency,
      current_period_end: subData.current_period_end,
      current_period_start: subData.current_period_start,
      // customer : subData.customer.toString(),
      // default_payment_method: subData.default_payment_method.toString(),
      description: subData.description,
      // discount : subData.discount,
      ended_at: subData.ended_at,
      // metadata: subData.metadata,
      // schedule : subData.schedule.toString(),
      start_date: subData.start_date,
      status: subData.status,

    })
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
