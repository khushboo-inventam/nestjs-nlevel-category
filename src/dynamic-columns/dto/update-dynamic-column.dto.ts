import { PartialType } from "@nestjs/swagger";
import { CreateDynamicColumnDto } from "./create-dynamic-column.dto";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateDynamicColumnDto extends PartialType(
  CreateDynamicColumnDto
) {
  @IsNotEmpty()
  @IsNumber()
  dynamic_id: number;
}
