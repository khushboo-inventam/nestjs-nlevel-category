import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateSubscriptionDto {
    @ApiProperty({ description: 'Enter the plan id' })
    @IsNumber()
    @IsNotEmpty()
    plan_id: number;

    @ApiProperty({ description: 'Enter the price id' })
    @IsNumber()
    @IsNotEmpty()
    price_id: number;

    @ApiPropertyOptional({ description: 'Enter the payment id' })
    @IsOptional()
    @IsNumber()
    payment_method_id: number;

    // @ApiPropertyOptional({ description: 'Enter the promotion code ' })
    // @IsString()
    // @IsOptional()
    // promotion_code: string;
}
