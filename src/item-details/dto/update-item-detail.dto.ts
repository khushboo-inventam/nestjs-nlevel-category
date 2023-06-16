import { PartialType } from '@nestjs/swagger';
import { CreateItemDetailDto } from './create-item-detail.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateItemDetailDto extends PartialType(CreateItemDetailDto) {
    @IsNotEmpty()
    @IsNumber()
    item_detail_id: number;
}
