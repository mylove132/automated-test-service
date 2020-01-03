import { Module } from '@nestjs/common';
import {WsService} from './ws.service';
import {RunModule} from '../run/run.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CaselistEntity} from '../caselist/caselist.entity';
import {HistoryEntity} from '../history/history.entity';


@Module({
    imports:[TypeOrmModule.forFeature([CaselistEntity, HistoryEntity]), RunModule],
    providers: [WsService],
})
export class WsModule {}
