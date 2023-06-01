import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class CreateItemDetailDto {
    @ApiProperty({ description: "Enter the plan id" })
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiProperty({ description: "Enter the dynamic column id " })
    @IsString()
    @IsNumberString()
    dynamic_id: string;

    @ApiProperty({ description: "Enter the payment id" })
    @IsString()
    @IsNumberString()
    item_id: string;


}
