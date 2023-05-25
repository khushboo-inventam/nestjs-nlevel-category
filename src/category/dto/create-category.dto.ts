import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumberString,
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
  @IsNumberString()
  parent_category_id: string;
}
