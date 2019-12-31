import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseEntity } from '../case/case.entity';

import { RunService } from './run.service';
import { RunController } from './run.controller';
import { CurlModule } from '../curl/curl.module'
import { CaselistEntity } from '../caselist/caselist.entity';

@Module({
  imports: [CurlModule, TypeOrmModule.forFeature([CaseEntity, CaselistEntity])],
  providers: [RunService],
  controllers: [RunController],
})
export class RunModule {}