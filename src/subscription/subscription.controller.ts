import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AllExceptionsFilter } from 'src/common/all-exceptions.filter';
import { ApiInternalServerErrorResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ERROR } from 'src/common/global-constants';
import { ChangeSubscriptionDto } from './dto/change-subscription.dto';
import { Public } from 'src/jwt/jwt-auth.guard';


@ApiSecurity('access_token')

@ApiInternalServerErrorResponse({
  description: ERROR.INTERNAL_SERVER_ERROR,
})
@ApiUnauthorizedResponse({
  description: ERROR.UNAUTHORIZED_ERROR,
})
@UseFilters(new AllExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags("subscription")
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  create(@Body() createSubscriptionDto: CreateSubscriptionDto, @Req() request) {
    return this.subscriptionService.create(createSubscriptionDto,  { user: { userId: 1 } });
  }

  @Get()
  findAll() {
    return this.subscriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionService.findOne(+id);
  }
 
  @Patch(':id')
  update() {
    return this.subscriptionService.update();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionService.remove(+id);
  }

  @Post('draft-invoice-selected-plan')
  async draftInvoiceSelectedPlan(@Body() changeSubscriptionDto: ChangeSubscriptionDto, @Req() request) {
    // User changes from one plan to another
    const subscriptionData = await this.subscriptionService.findDraftInvoiceSelectedPlan(
      changeSubscriptionDto,
      request,
    );

    return subscriptionData;
  }

  @Public()
  @Post('webhook')
  async webhookImpletion(@Req() request) {
    // webhookCreate
    // console.log(request.headers)
    const subscriptionData = await this.subscriptionService.webhookCreate(request);
    return subscriptionData;
  }
}
