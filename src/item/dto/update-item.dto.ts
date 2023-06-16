import { PartialType } from "@nestjs/swagger";
import { CreateItemDto } from "./create-item.dto";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @IsNotEmpty()
  @IsNumber()
  item_id: number;
}
