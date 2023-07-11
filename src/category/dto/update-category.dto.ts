import { PartialType } from "@nestjs/swagger";
import { CreateCategoryDto } from "./create-category.dto";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsNotEmpty()
    @IsNumber()
    category_id: number;
}
