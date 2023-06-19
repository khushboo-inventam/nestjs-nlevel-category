import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateItemDto {

    @ApiProperty({ description: "Enter the item name " })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ description: "Enter the item's description" })
    @IsOptional()
    item_description: string;

    @ApiPropertyOptional({ description: "Enter the item's image" })
    @IsOptional()
    image: string;

    @ApiPropertyOptional({ description: "Enter the item's image" })
    @IsNotEmpty()
    item_code: string;

}
