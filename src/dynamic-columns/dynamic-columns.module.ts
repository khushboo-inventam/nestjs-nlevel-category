import { Module } from '@nestjs/common';
import { DynamicColumnsService } from './dynamic-columns.service';
import { DynamicColumnsController } from './dynamic-columns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicColumn } from './entities/dynamic-column.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DynamicColumn])],
  controllers: [DynamicColumnsController],
  providers: [DynamicColumnsService]
})
export class DynamicColumnsModule {}
