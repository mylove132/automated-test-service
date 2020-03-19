import { Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {SchedulerEntity} from './scheduler.entity';
import {EnvEntity} from '../env/env.entity';
import {SchedulerService} from './scheduler.service';
import {SchedulerController} from './scheduler.controller';
import {RunModule} from "../run/run.module";
import {CaseEntity} from "../case/case.entity";


@Module({
    imports: [ TypeOrmModule.forFeature([SchedulerEntity,EnvEntity, CaseEntity]),RunModule],
    providers: [SchedulerService],
    controllers: [
        SchedulerController
    ]
})
export class SchedulerModule {

}
