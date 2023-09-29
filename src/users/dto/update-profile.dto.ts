import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: 'Enter the client name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  full_name: string;

  @ApiProperty({ description: 'is user professional photographer' })
  @IsBoolean()
  is_professional: boolean;

  @ApiPropertyOptional({ description: 'Enter Company name' })
  @IsOptional()
  @ValidateIf((o) => o.is_professional === true)
  @IsString()
  company_name: string;

  @ApiPropertyOptional({ description: 'Enter Company email' })
  @IsOptional()
  @IsEmail()
  company_email: string;

  @ApiPropertyOptional({ description: 'Enter Company mobile no' })
  @IsOptional()
  @IsString()
  company_mobile_no: string;

  @ApiPropertyOptional({ description: 'Enter Company website' })
  @IsOptional()
  @IsString()
  company_website: string;

  @ApiPropertyOptional({ description: 'Enter Company address' })
  @IsOptional()
  @IsString()
  company_address: string;

  @ApiPropertyOptional({ description: 'Enter Company Facebook link' })
  @IsOptional()
  @IsString()
  facebook_link: string;

  @ApiPropertyOptional({ description: 'Enter Company Instagram link' })
  @IsOptional()
  @IsString()
  instagram_link: string;

  @ApiPropertyOptional({ description: 'Enter Company other social link' })
  @IsOptional()
  @IsString()
  other_social_link: string;
}
