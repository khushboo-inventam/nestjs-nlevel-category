import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePlanDto {

    @ApiProperty({ description: "Enter the plan name " })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "Enter the plan's description" })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiPropertyOptional({ description: "Enter the plan's image" })
    @IsOptional()
    item_description: string;

    @ApiPropertyOptional({ description: "Enter the plan's image" })
    @IsOptional()
    metadata : string;

    @ApiPropertyOptional({ description: "Enter the plan's image" })
    @IsOptional()
    image: string;

    @ApiProperty({ description: "Enter the plan name " })
    @IsBoolean()
    active: boolean;
 
}
