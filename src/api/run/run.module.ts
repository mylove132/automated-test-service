import {DynamicModule, Module} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseEntity } from '../case/case.entity';

import { RunService } from './run.service';
import { RunController } from './run.controller';
import { CurlModule } from '../curl/curl.module'
import { EnvModule } from '../env/env.module'
import { CaselistEntity } from '../caselist/caselist.entity';
import { HistoryModule } from '../history/history.module';
import {SceneEntity} from "../scene/scene.entity";
import {TokenEntity} from "../token/token.entity";
import { RunProcessor } from "./run.processor";
import { BullModule } from "@nestjs/bull";
import {ConfigService} from "../../config/config.service";


const RedisConfig = (): DynamicModule => {
  console.log('连接redis中....');
  const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  return BullModule.registerQueue(config.getQueueConfig());
};

@Module({
  imports: [RedisConfig(), EnvModule, CurlModule, HistoryModule, TypeOrmModule.forFeature([CaseEntity, CaselistEntity, SceneEntity, TokenEntity])],
  providers: [RunService, RunProcessor],
  controllers: [RunController],
  exports: [RunService]
})
export class RunModule {}
