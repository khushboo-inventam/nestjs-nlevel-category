/* eslint-disable max-classes-per-file */
/* eslint-disable camelcase */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateUserPaymentIntentDto {
  @ApiProperty({ description: 'Enter the payment method types.' })
  @IsString()
  @IsNotEmpty()
  payment_method_types: string;

  @ApiProperty({ description: 'Enter the amount.' })
  @IsNotEmpty()
  @IsNumberString()
  amount: string;

  @ApiPropertyOptional({ description: 'Enter the id of payment method' })
  @IsOptional()
  @IsString()
  payment_method_id: string;
}
