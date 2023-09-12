import { Inject, Injectable } from '@nestjs/common';
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


  async create(createPaymentMethodDto: CreatePaymentMethodDto) {

    let insertPaymentMethod
    try {

      insertPaymentMethod = await this.paymentMethodRepo.create({
        ...createPaymentMethodDto
      })
    } catch (error) {
      console.log('error ', error)
    }

    if (insertPaymentMethod && insertPaymentMethod !== undefined) {

      const addpaymentMethodStripe = await this.stripeClient.products.create({
        name: insertPaymentMethod.name
      })

      if (insertPaymentMethod && insertPaymentMethod !== undefined && addpaymentMethodStripe?.id && addpaymentMethodStripe?.id !== undefined) {
        await this.paymentMethodRepo.update({ payment_method_id: insertPaymentMethod.payment_methods_id },
          { stripe_payment_method_id: addpaymentMethodStripe.id })
      }
    }


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
