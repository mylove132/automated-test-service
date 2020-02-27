import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseEntity } from '../case/case.entity';

import { RunService } from './run.service';
import { RunController } from './run.controller';
import { CurlModule } from '../curl/curl.module'
import { EnvModule } from '../env/env.module'
import { CaselistEntity } from '../caselist/caselist.entity';
import { HistoryModule } from '../history/history.module';
import {SceneEntity} from "../scene/scene.entity";

@Module({
  imports: [EnvModule, CurlModule, HistoryModule, TypeOrmModule.forFeature([CaseEntity, CaselistEntity, SceneEntity])],
  providers: [RunService],
  controllers: [RunController],
  exports: [RunService]
})
export class RunModule {}
