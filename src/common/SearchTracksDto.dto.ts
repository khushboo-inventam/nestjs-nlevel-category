import { IsNumberString, IsString, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class SearchTracksDto {
  @ApiPropertyOptional({
    description: "The searched string by user for desired tracks",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: "The page of desired track list",
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @ApiPropertyOptional({
    description:
      "The number of track required on single page for desired tracks",
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string = "10";

  @ApiPropertyOptional({
    description: "The searched string by user for desired tracks",
    required: false,
  })
  @IsOptional()
  @IsString()
  sort_column?: string;

  @ApiPropertyOptional({
    description: "The searched string by user for desired tracks",
    required: false,
  })
  @IsOptional()
  @IsString()
  sort_order: string;
}
