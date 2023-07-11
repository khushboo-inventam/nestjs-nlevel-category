import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,

  IsOptional,
  IsString,
} from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ description: "Enter the plan id" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: "Enter the parent category id" })
  @IsOptional()
  @IsNumber()
  parent_category_id: number;
}
