import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {CaseEntity} from '../case/case.entity';
import {CaselistEntity} from './caselist.entity';
import {CaselistService} from './caselist.service';
import {CaselistController} from './caselist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CaseEntity, CaselistEntity])],
  providers: [CaselistService],
  controllers: [
    CaselistController
  ]
})
export class CaseListModule {

}
