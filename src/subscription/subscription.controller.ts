import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AllExceptionsFilter } from 'src/common/all-exceptions.filter';
import { ApiTags } from '@nestjs/swagger';

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
}
