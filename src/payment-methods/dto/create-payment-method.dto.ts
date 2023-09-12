import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';


export class CreatePaymentMethodDto {
  @ApiProperty({ description: 'Enter the user`s email ' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Enter the user`s name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Enter the user`s phone' })
  @IsOptional()
  @IsNumberString()
  phone: string;

  @ApiProperty({ description: 'Enter the name of card`s brand name' })
  @IsNotEmpty()
  @IsString()
  card_brand: string;

  @ApiProperty({ description: 'Enter the name of funding' })
  @IsNotEmpty()
  @IsString()
  funding: string;

  @ApiProperty({ description: 'Enter the card`s last four digit .' })
  @IsNotEmpty()
  @IsNumber()   
  last4: number;

  @ApiProperty({ description: 'Enter the type : card ' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'Enter the address line1 ' })
  @IsOptional()
  @IsString()
  line1: string;

  @ApiPropertyOptional({ description: 'Enter the address line2 ' })
  @IsOptional()
  @IsString()
  line2: string;

  @ApiPropertyOptional({ description: 'Enter the name of city ' })
  @IsOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional({ description: 'Enter the name of country' })
  @IsOptional()
  @IsString()
  country: string;

  @ApiPropertyOptional({ description: 'Enter the name of state' })
  @IsOptional()
  @IsString()
  state: string;

  @ApiPropertyOptional({ description: 'Enter the postal_code ' })
  @IsOptional()
  @IsString()
  postal_code: string;
}
