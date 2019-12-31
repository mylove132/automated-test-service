import {DynamicModule, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {SchedulerEntity} from './scheduler.entity';
import {CaselistEntity} from '../caselist/caselist.entity';
import {EnvEntity} from '../env/env.entity';
import {SchedulerService} from './scheduler.service';
import {SchedulerController} from './scheduler.controller';
import {ConfigService} from '../../config/config.service';
import {BullModule} from '@nestjs/bull';
import {QueueConsumer} from './queue.consumer';


const Queue = (): DynamicModule => {
    const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
    return BullModule.registerQueue(config.getQueueConfig());
};

@Module({
    imports: [ Queue(),TypeOrmModule.forFeature([SchedulerEntity, CaselistEntity,EnvEntity])],
    providers: [QueueConsumer, SchedulerService],
    controllers: [
        SchedulerController
    ]
})
export class SchedulerModule {

}
