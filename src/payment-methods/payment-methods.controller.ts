import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, UseFilters, ValidationPipe, UsePipes, Req } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { AllExceptionsFilter } from 'src/common/all-exceptions.filter';
import { ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PAYMENT } from 'src/common/global-constants';
import { GetAllUserPaymentMethodResponse, UserPaymentMethodResponse } from './dto/user-payment-method-response.dto';
import { CreateUserPaymentIntentDto } from './dto/create-user-payment-intent.dto';


@ApiSecurity('access_token')
@UseFilters(new AllExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("payment-methods")
@Controller('payment-methods')
export class PaymentMethodsController {


  constructor(private readonly paymentMethodsService: PaymentMethodsService
  ) { }

  @Post()
  create(@Body() createPaymentMethodDto: CreatePaymentMethodDto, @Req() request) {
    return this.paymentMethodsService.createPaymentMethod(createPaymentMethodDto, { user: { userId: 1 } });
  }

 
  @ApiCreatedResponse({
    description: PAYMENT.CREATED,
    type: UserPaymentMethodResponse,
  })
  @Post('payment-intent')
  async createPaymentIntent(@Body() createUserPaymentIntentDto: CreateUserPaymentIntentDto, @Req() request) {
    const paymentData = await this.paymentMethodsService.addUserPaymentIntent(createUserPaymentIntentDto, request);
    return {
      data: paymentData,
      message: PAYMENT.PAYMENT_INTENT_CREATED,
    };
  }

  @ApiCreatedResponse({
    description: PAYMENT.CREATED,
    type: UserPaymentMethodResponse,
  })
  @Post('payment-setup-intent')
  async createSetupPaymentIntent(@Body() createUserPaymentIntentDto: CreateUserPaymentIntentDto, @Req() request) {
    const paymentData = await this.paymentMethodsService.addUserSetupPaymentIntent(
      createUserPaymentIntentDto,
      request,
    );
    return {
      data: paymentData,
      message: PAYMENT.PAYMENT_INTENT_CREATED,
    };
  }

  @ApiOkResponse({
    description: 'List of payment details',
    type: GetAllUserPaymentMethodResponse,
  })
  @Get()
  async findAll(@Req() request) {
    const paymentFindData = await this.paymentMethodsService.findAll(request);
    return {
      data: paymentFindData,
      message: PAYMENT.FETCHED,
    };
  }

  @ApiOkResponse({
    description: 'Number of various payment attempts per day',
  })
  @Get('total-payments-attempts')
  async totalPaymentAttempt(@Req() request) {
    const paymentFindData = await this.paymentMethodsService.findPaymentAttempt(request);
    const succeedPayments = paymentFindData.filter((payment) => payment.status === 'succeeded').length;
    const failedPayments = paymentFindData.filter((payment) => payment.status === 'failed').length;
    return {
      data: {
        total: paymentFindData.length,
        succeeded: succeedPayments,
        failed: failedPayments,
      },
      message: PAYMENT.FETCHED,
    };
  }
}
