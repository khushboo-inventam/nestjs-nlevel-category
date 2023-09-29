import {
  IsNumberString,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: 'Is pagination is enable for this list',
    default: true,
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  is_paginated: boolean;

  @ApiPropertyOptional({
    description: 'search',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'The page of list',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @ApiPropertyOptional({
    description: 'The number of row required on single page for',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string = '10';

  @ApiPropertyOptional({
    description: 'Sort column',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort_column?: string;

  @ApiPropertyOptional({
    description: 'Sort order set it as asc/desc',
    required: false,
  })
  @IsOptional()
  @IsString()
  sort_order: string;
}
