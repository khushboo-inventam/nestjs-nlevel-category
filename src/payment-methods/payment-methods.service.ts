import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { STRIPE_TOKEN } from 'src/stripe/stripe-options.interface';
import Stripe from 'stripe';
import { PaymentMethod } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class PaymentMethodsService {

  constructor(@Inject(STRIPE_TOKEN) private readonly stripeClient: Stripe,
    @InjectRepository(PaymentMethod) private readonly paymentMethodRepo: Repository<PaymentMethod>) {
  }


  async create(createPaymentMethodDto: CreatePaymentMethodDto,request ) {
    // const stripeCustomerId = await this.usersService.findOne({ is_deleted: false, id: request.user.userId });
    const  stripeCustomerId ={stripe_user_id :  ''}
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

  findAll() {
    return `This action returns all paymentMethods`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentMethod`;
  }

  update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return `This action updates a #${id} paymentMethod`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentMethod`;
  }
}
