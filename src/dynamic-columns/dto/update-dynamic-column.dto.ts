import { PartialType } from '@nestjs/swagger';
import { CreateDynamicColumnDto } from './create-dynamic-column.dto';

export class UpdateDynamicColumnDto extends PartialType(CreateDynamicColumnDto) {}
