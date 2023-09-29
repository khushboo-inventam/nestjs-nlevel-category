import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { STRIPE_TOKEN } from 'src/stripe/stripe-options.interface';
import Stripe from 'stripe';
import { PaymentMethod } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
let customerId: string = '';

@Injectable()
export class PaymentMethodsService {

  constructor(@Inject(STRIPE_TOKEN) private readonly stripeClient: Stripe,
    @InjectRepository(PaymentMethod) private readonly paymentMethodRepo: Repository<PaymentMethod>) {
  }


  async create(createPaymentMethodDto: CreatePaymentMethodDto, request) {
    // const stripeCustomerId = await this.usersService.findOne({ is_deleted: false, id: request.user.userId });
    const stripeCustomerId = { stripe_user_id: 'cus_Oi0Cdt3UDLAvow' }
    // const addNewPayment  = await  this.stripeClient.paymentMethods.retrieve('pm_1NvaH0SHLpLnkvtAHOTmZc58')
   const addNewPayment = await this.stripeClient.paymentMethods
        .attach(createPaymentMethodDto.payment_method_id, {
          customer: stripeCustomerId.stripe_user_id,
        })
      .then(async (paymentMethodData) => {
        // console.log('data', paymentMethodData);
        const addNewPaymentDetail = await this.paymentMethodRepo.create({
          stripe_payment_method_id: paymentMethodData.id,
          email: paymentMethodData.billing_details.email,
          name: paymentMethodData.billing_details.name,
          phone: paymentMethodData.billing_details.phone,
          card_brand: paymentMethodData.card.brand,
          funding: paymentMethodData.card.funding,
          last4: +paymentMethodData.card.last4,
          type: paymentMethodData.type,
          line1: paymentMethodData.billing_details.address.line1,
          line2: paymentMethodData.billing_details.address.line2,
          city: paymentMethodData.billing_details.address.city,
          country: paymentMethodData.billing_details.address.country,
          state: paymentMethodData.billing_details.address.state,
          postal_code: paymentMethodData.billing_details.address.postal_code,
          user_id: request.user.userId,
          created_by: request.user.userId,
        });
        return addNewPaymentDetail;
      })
      .catch((error) => {
        //     console.log('error', error);
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      });

    return addNewPayment;

  }

  async addUserPaymentIntent(createUserPaymentIntentDto, request) {
    // const stripeCustomerId = await this.usersService.findOne({ is_deleted: false, id: request.user.userId });

    const {
      payment_method_types: paymentMethodTypes,
      amount,
      payment_method_id: paymentMethodId,
    } = createUserPaymentIntentDto;

    const dataAdd = {
      payment_method_types: [paymentMethodTypes],
      amount: parseInt(`${+amount * 100}`, 10),
      currency: 'usd',
    };
    if (paymentMethodId && paymentMethodId !== undefined) {
      Object.assign(dataAdd, { payment_method: paymentMethodId });
    }
    // console.log('dataAdd', dataAdd);
    const addNewPaymentIntent = await this.stripeClient.paymentIntents.create({
      ...dataAdd,
      setup_future_usage: 'off_session',
      // customer: stripeCustomerId.stripe_user_id,
      customer: customerId
    });
    return addNewPaymentIntent;
  }

  async addUserSetupPaymentIntent(createUserPaymentIntentDto, request) {
    // const stripeCustomerId = await this.usersService.findOne({ is_deleted: false, id: request.user.userId });

    const { payment_method_types: paymentMethodTypes, payment_method_id: paymentMethodId } = createUserPaymentIntentDto;

    const dataAdd = {
      payment_method_types: [paymentMethodTypes],
    };
    if (paymentMethodId && paymentMethodId !== undefined) {
      Object.assign(dataAdd, { payment_method: paymentMethodId });
    }
    // console.log('dataAdd', dataAdd);
    const addNewPaymentIntent = await this.stripeClient.setupIntents.create({
      ...dataAdd,
      usage: 'off_session',
      //  customer: stripeCustomerId.stripe_user_id,
      customer: customerId
    });
    return addNewPaymentIntent;
  }

  async findAll(request) {
    return this.paymentMethodRepo.find({ where: { user_id: request.user.userId, is_deleted: false } });
  }

  async findOne(where) {
    return this.paymentMethodRepo.findOne(where);
  }

  async findPaymentAttempt(request) {
    // const stripeCustomerId = await this.usersService.findOne({ is_deleted: false, id: request.user.userId });
    const timezoneDiff = new Date(1970, 0, 1).getTime();
    const today = new Date();
    const currentUT = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() - timezoneDiff;
    const paymentIntents = await this.stripeClient.charges.search({
      // query: `status:'failed' AND customer:'${stripeCustomerId.stripe_user_id}' AND currency:'usd' AND created>${
      //   currentUT / 1000
      // }`,
      // query: `customer:'${stripeCustomerId.stripe_user_id}' AND currency:'usd' AND created>${currentUT / 1000}`,
      query: `customer:'${customerId}' AND currency:'usd' AND created>${currentUT / 1000}`,
      limit: 100,
    });
    return paymentIntents.data;
  }

  async remove(where, request) {
    const whereCondition = {
      is_deleted: false,
    };
    if (where) Object.assign(whereCondition, where);
    return this.paymentMethodRepo.update(where, {
      is_deleted: true,
      // deleted_at: new Date(),
      deleted_by: request.user.userId,
    });
  }

  async createPaymentMethod(createPaymentMethodDto: CreatePaymentMethodDto, request) {
    const paymentMethod = await this.stripeClient.paymentMethods.create({
      type: 'card',

      card: {
        number: '4000056655665556',
        exp_month: 12,
        exp_year: 2034,
        cvc: '314',
      },
      billing_details: {
        email: 'khushbu@inventam.com'
      }
    });



  }
}
