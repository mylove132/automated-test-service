import { Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {SchedulerEntity} from './scheduler.entity';
import {EnvEntity} from '../env/env.entity';
import {SchedulerService} from './scheduler.service';
import {SchedulerController} from './scheduler.controller';
import {RunModule} from "../run/run.module";
import {CaseEntity} from "../case/case.entity";
import { QueueModule } from "../queue/queue.module";
import { TaskResultEntity } from "./task_result.entity";
import {CatalogEntity} from "../catalog/catalog.entity";
import { JmeterEntity } from '../jmeter/jmeter.entity';
import { JmeterResultEntity } from '../jmeter/jmeter_result.entity';
import { RedisModule } from 'src/redis/redis.module';


@Module({
    imports: [ TypeOrmModule.forFeature([SchedulerEntity,EnvEntity, CaseEntity, TaskResultEntity, CatalogEntity, JmeterEntity, JmeterResultEntity]),QueueModule, RunModule, RedisModule],
    providers: [SchedulerService],
    controllers: [
        SchedulerController
    ]
})
export class SchedulerModule {
    //重启系统的定时任务
     constructor(private sch: SchedulerService) {
        sch.restartTask();
    }
}
