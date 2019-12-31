import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {CaseEntity} from '../case/case.entity';
import {CaselistEntity} from './caselist.entity';
import {CaselistService} from './caselist.service';
import {CaselistController} from './caselist.controller';
import {EnvEntity} from '../env/env.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CaseEntity, CaselistEntity, EnvEntity])],
  providers: [CaselistService],
  controllers: [
    CaselistController
  ]
})
export class CaseListModule {

}
