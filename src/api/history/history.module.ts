import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from './history.entity';
import { CaseEntity } from '../case/case.entity';

import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';


@Module({
  imports: [TypeOrmModule.forFeature([HistoryEntity, CaseEntity])],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}