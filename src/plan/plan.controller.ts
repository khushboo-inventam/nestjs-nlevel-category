import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AllExceptionsFilter } from 'src/common/all-exceptions.filter';
import { ApiInternalServerErrorResponse, ApiSecurity, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ERROR } from 'src/common/global-constants';


@ApiSecurity('access_token')

@UsePipes(new ValidationPipe({ transform: true }))
@ApiInternalServerErrorResponse({
  description: ERROR.INTERNAL_SERVER_ERROR,
})
@ApiUnauthorizedResponse({
  description: ERROR.UNAUTHORIZED_ERROR,
})

@UseFilters(new AllExceptionsFilter())
@ApiTags("plan")

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @Get()
  findAll() {
    return this.planService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(+id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(+id);
  }
}
