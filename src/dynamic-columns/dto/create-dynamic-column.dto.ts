import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateDynamicColumnDto {
    @ApiProperty({ description: "Enter the name of dynamic column " })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: "Enter the type of dynamic column " })
    @IsNotEmpty()
    @IsString()
    type: string;

}
