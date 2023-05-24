import { Module } from '@nestjs/common';
import { DynamicColumnsService } from './dynamic-columns.service';
import { DynamicColumnsController } from './dynamic-columns.controller';

@Module({
  controllers: [DynamicColumnsController],
  providers: [DynamicColumnsService]
})
export class DynamicColumnsModule {}
