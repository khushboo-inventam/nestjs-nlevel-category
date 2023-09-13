 
 import { ApiProperty } from '@nestjs/swagger';
 import { IsNotEmpty, IsString } from 'class-validator';
 
export class CreatePaymentMethodDto { 
  @ApiProperty({ description: 'Enter the id of payment method' })
  @IsNotEmpty()
  @IsString()
  payment_method_id: string;
}
