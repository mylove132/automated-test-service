import { Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {SchedulerEntity} from './scheduler.entity';
import {CaselistEntity} from '../caselist/caselist.entity';
import {EnvEntity} from '../env/env.entity';
import {SchedulerService} from './scheduler.service';
import {SchedulerController} from './scheduler.controller';
import {RunModule} from "../run/run.module";


@Module({
    imports: [ TypeOrmModule.forFeature([SchedulerEntity, CaselistEntity,EnvEntity]),RunModule],
    providers: [SchedulerService],
    controllers: [
        SchedulerController
    ]
})
export class SchedulerModule {

}
