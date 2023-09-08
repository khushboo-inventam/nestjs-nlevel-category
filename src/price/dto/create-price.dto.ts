import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreatePriceDto {
    @ApiProperty({ description: "Enter the plan id " })
    @IsNumber()
    @IsNotEmpty()
    plan_id: number;

    @ApiProperty({ description: "Enter the price's currency" })
    @IsString()
    @IsNotEmpty()
    currency: string;

    @ApiProperty({ description: "Enter the price's currency" })
    @IsString()
    @IsNotEmpty()
    unit_amount: string

    @ApiProperty({ description: "Enter the price's currency" })
    @IsString()
    @IsNotEmpty()
    interval: string;

    @ApiProperty({ description: "Enter the price's currency" })
    @IsNumber()
    @IsNotEmpty()
    interval_count: number;

    @ApiProperty({ description: "Enter the plan name " })
    @IsBoolean()
    active: boolean;
}
