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
import { PROMOCODE, SUBSCRIPTIONS } from 'src/common/global-constants';
import { IGetStripeSubcription } from './interface/stripe-get-subscription';
import { User } from 'src/users/entities/user.entity';
import * as moment from 'moment';


@Injectable()
export class SubscriptionService {


  constructor(@InjectRepository(Price) private readonly priceRepo: Repository<Price>,
    @InjectRepository(Plan) private readonly planRepo: Repository<Plan>,
    @InjectRepository(Subscription) private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(PaymentMethod) private readonly paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
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

  async updateSubscriptionWebhook(updatedSub, perviousAttribute?) {
    if (!updatedSub || updatedSub === undefined)
      throw new HttpException('No Subscription Data found in webhook ', HttpStatus.NOT_FOUND);
  

    const customerData = await this.userRepo.findOne({
    where: {    email_verified: true,
    is_deleted: false,
    stripe_user_id: updatedSub.customer,}
    });

    if (!customerData || customerData === undefined)
      throw new HttpException('No customer found  ', HttpStatus.NOT_FOUND);

    let userDetailId;
    const currentSubscription = await this.subscriptionRepo.findOne({where: { user_id: customerData.user_id, is_deleted: false }});
    if (currentSubscription && currentSubscription !== undefined) userDetailId = currentSubscription.user_id;

    let scheduler;
    if (updatedSub.schedule != null && updatedSub.schedule !== undefined)
      scheduler = await this.stripeClient.subscriptionSchedules.retrieve(updatedSub.schedule);
    if (scheduler && scheduler !== undefined && scheduler !== null) {
      if (scheduler.phases[0].end_date <= +moment().unix().toString() && scheduler.status === 'active') {
        await this.stripeClient.subscriptionSchedules.release(updatedSub.schedule);
      }
    }

    if (updatedSub.status === 'active') {
      // TODO : If any another plan then free and  default payment method available,status active plus scheduler available
      // then   1> release scheduler  2> assigned  new plan

      const newPriceDetail = await this.planRepo.getPlanNameByPrice({
        is_deleted: false,
        stripe_price_id: updatedSub.plan.id,
        active: true,
      });
      if (newPriceDetail && newPriceDetail !== undefined && newPriceDetail !== null) {
        if (
          (!updatedSub.default_payment_method || updatedSub.default_payment_method === undefined) &&
         // newPriceDetail.plan_name !== PLANS_NAME.FREE
        ) {
          
          await this.checkAndUpdateCancelSubscription(updatedSub);
        } else {
          const latestSubData = await this.stripeClient.subscriptions.retrieve(updatedSub.id);

          const latestPriceDetail = await this.priceRepo.findOne({
          where :{is_deleted: false,
          stripe_price_id: latestSubData.items.data[0].price.id,
          active: true,}
          });
          await this.userSubscriptionUpdate(latestPriceDetail, latestSubData);
          
        }
      }
    } else if (updatedSub.status === 'trialing') {
    
      const latestSubData = await this.stripeClient.subscriptions.retrieve(updatedSub.id);
      const latestPriceDetail = await this.priceRepo.findOne({
        where :{is_deleted: false,
        stripe_price_id: latestSubData.items.data[0].price.id,
        active: true,}
      });
      await this.userSubscriptionUpdate(latestPriceDetail, latestSubData);
     
    } else if (updatedSub.status === 'canceled') {
      await this.checkAndUpdateCancelSubscription(updatedSub);

    } else if (updatedSub.status === 'paused') {
      if (perviousAttribute?.status === 'trialing') await this.checkAndUpdateCancelSubscription(updatedSub);
    }
    return true;
  }

  async webhookCreate(request) {
    const endpointSecret = this.configService.get('app.stripe_webhook_key');
    const sig = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      const stripePayload = request.rawBody;
     
      // eslint-disable-next-line prefer-const
      event = await this.stripeClient.webhooks.constructEvent(
        stripePayload?.toString(),
        sig?.toString(),
        endpointSecret,
      );
    } catch (err) {
      
      throw new HttpException(SUBSCRIPTIONS.WEBHOOK_BAD_REQUEST, HttpStatus.BAD_REQUEST);
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.updated':
        // const subscriptionUpdate = event.data.object;
        await this.updateSubscriptionWebhook(event.data.object, event.data.previous_attributes);
        break;
      case 'customer.subscription.deleted':
        await this.updateSubscriptionWebhook(event.data.object);
        break;
      case 'customer.subscription.paused':
        await this.updateSubscriptionWebhook(event.data.object, event.data.previous_attributes);
        break;
      case 'invoice.paid':
      //  await this.updateSubscriptionAfterPayment(event.data.object);
        break;
      // case 'product.created':
      //   await this.plansService.planWebHookCreateUpdate(event.data.object);
      //   break;
      // case 'product.deleted':
      //   await this.plansService.planWebHookCreateUpdate(event.data.object);
      //   break;
      // case 'product.updated':
      //   await this.plansService.planWebHookCreateUpdate(event.data.object);
      //   break;
      // case 'price.created':
      //   await this.plansService.priceWebHookCreateUpdate(event.data.object);
      //   break;
      // case 'price.deleted':
      //   await this.plansService.priceWebHookCreateUpdate(event.data.object);
      //   break;
      // case 'price.updated':
      //   await this.plansService.priceWebHookCreateUpdate(event.data.object);
      //   break;
      // case 'payment_intent.payment_failed':
      //   break;
      case 'invoice.payment_failed':
      //  await this.paymentFailedAtSubscription(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        //  await this.updateUserCreditBalance(event.data.object);
        // Then define and call a function to handle the event price.updated
        break;
      // case 'customer.subscription.trial_will_end':
      //   await this.goodByeTrialSubscription(event.data.object);
      //   break;
      default:
    }
  }
  async findDraftInvoiceSelectedPlan(changeSubscriptionDto, request) {
    const prorationDate = Math.floor(Date.now() / 1000);

    const subscriptionData = await this.subscriptionRepo.findOne({
     where:{ user_id: request.user.userId,
      is_deleted: false,
      canceled_at: null,}
    });
    if (!subscriptionData) return false;

    const currentPlanDetail = await this.planRepo.findOne({
    where: {  is_deleted: false,
      active: true,
      plan_id: subscriptionData.plan_id,}
    });
    const currentPriceDetail = await this.priceRepo.findOne({
      where:{is_deleted: false,
      active: true,
      price_id: subscriptionData.price_id,}
    });
    const currentDetail = {
      plan_id: currentPlanDetail.plan_id,
      stripe_plan_id: currentPlanDetail.stripe_plan_id,
      name: currentPlanDetail.name,
      description: currentPlanDetail.description,
      price_id: currentPriceDetail.price_id,
      stripe_price_id: currentPriceDetail.stripe_price_id,
      unit_amount: currentPriceDetail.unit_amount,
    };

    const changePlanDetail = await this.planRepo.findOne({
      where:{is_deleted: false,
      active: true,
      plan_id: changeSubscriptionDto.plan_id,}
    });
    const changePriceDetail = await this.priceRepo.findOne({
      where :{is_deleted: false,
      active: true,
      price_id: changeSubscriptionDto.price_id,}
    });

    const changeDetail = {
      plan_id: changePlanDetail.plan_id,
      stripe_plan_id: changePlanDetail.stripe_plan_id,
      name: changePlanDetail.name,
      description: changePlanDetail.description,
      price_id: changePriceDetail.price_id,
      stripe_price_id: changePriceDetail.stripe_price_id,
      unit_amount: changePriceDetail.unit_amount,
    };

    const subscription = await this.stripeClient.subscriptions.retrieve(subscriptionData.stripe_subscription_id);

    const priceDetail = await this.priceRepo.findOne({
      where :{is_deleted: false,
      active: true,
      price_id: changeSubscriptionDto.price_id,}
    });

    // See what the next invoice would look like with a price switch
    // and proration set:
    const items = [
      {
        id: subscription.items.data[0].id,
        price: priceDetail.stripe_price_id, // 'price_1Lomn2LFNE9bOCjOiwOA38BT', // Switch to new price
      },
    ];
    let couponCode;
    let couponSuccessMessage = null;
    if (typeof changeSubscriptionDto === 'object' && 'promotion_code' in changeSubscriptionDto) {
      const couponData: any = await this.stripeClient.promotionCodes.list({
        code: changeSubscriptionDto.promotion_code,
        active: true,
      });
      if (!couponData || couponData === undefined || couponData.data.length === 0)
        throw new HttpException(PROMOCODE.INVALID, HttpStatus.BAD_REQUEST);
      // eslint-disable-next-line prefer-const
      couponCode = { coupon: couponData.data[0].coupon.id };
      couponSuccessMessage = PROMOCODE.APPLIED;
    }

    const invoice = await this.stripeClient.invoices.retrieveUpcoming({
      customer: subscriptionData.customer,
      subscription: subscriptionData.stripe_subscription_id,
      subscription_items: items,
      subscription_proration_date: prorationDate,
      // subscription_proration_behavior: 'always_invoice',
      subscription_trial_end: 'now',
      subscription_billing_cycle_anchor: 'now',
      ...couponCode,
    });

    return {
      ...invoice,
      current_detail: currentDetail,
      change_detail: changeDetail,
      coupon_message: couponSuccessMessage,
    };
  }


  async checkAndUpdateCancelSubscription(updatedSub) {
 
 
      const userStipreDetail = await this.stripeClient.subscriptions.list({
        customer: updatedSub.customer,
        status: 'active',
      });

      if (!userStipreDetail || userStipreDetail === undefined || !userStipreDetail?.data?.length) {
        const userDetail = await this.userRepo.findOne({where: { is_deleted: false, stripe_user_id: updatedSub.customer }});
        // const userDetail = await this.userRepo.findOne({where: { is_deleted: false, stripe_user_id: updatedSub.customer }});

        // give free subscription to them
        // await this.save({ user: { userId: userDetail.id } }, '');
 
      }
   
  }
}
