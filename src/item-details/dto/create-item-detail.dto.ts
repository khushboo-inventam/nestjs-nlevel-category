import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateItemDetailDto {
    @ApiProperty({ description: "Enter the plan id" })
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiProperty({ description: "Enter the dynamic column id " })
    @IsNotEmpty()
    @IsNumber()
    dynamic_id: number;

    @ApiProperty({ description: "Enter the payment id" })
    @IsNotEmpty()
    @IsNumber()
    item_id: number;
}
