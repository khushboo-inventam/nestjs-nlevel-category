import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateItemDto {

    @ApiProperty({ description: "Enter the item name " })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ description: "Enter the item's description" })
    @IsOptional()
    @IsNumberString()
    item_description: string;

    @ApiPropertyOptional({ description: "Enter the item's image" })
    @IsOptional()
    @IsNumberString()
    image: string;

    @ApiPropertyOptional({ description: "Enter the item's image" })
    @IsOptional()
    @IsNumberString()
    item_code: string;

}
