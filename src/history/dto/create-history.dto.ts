import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,

  IsOptional,
  IsString,
} from "class-validator";

export class CreateHistoryDto {
  @ApiProperty({ description: "Enter the module name" })
  @IsString()
  @IsNotEmpty()
  module: string;

  @ApiPropertyOptional({ description: "Enter the parent category id" })
  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsString()
  action: string;

  @IsOptional()
  @IsString()
  before: string;

  @IsOptional()
  @IsString()
  after: string;

  @IsOptional()
  @IsString()
  action_at: string;
}
