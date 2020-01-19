import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {CaseEntity} from './case.entity';
import {CaseService} from './case.service';
import {CaseController} from './case.controller';
import {CatalogEntity} from '../catalog/catalog.entity';
import {CaselistEntity} from '../caselist/caselist.entity';
import {EndpointEntity} from '../env/endpoint.entity';
import {EnvModule} from "../env/env.module";
import {AssertJudgeEntity, AssertTypeEntity} from "./assert.entity";



@Module({
  imports: [EnvModule, TypeOrmModule.forFeature([CaseEntity, CatalogEntity, CaselistEntity, EndpointEntity, AssertTypeEntity, AssertJudgeEntity])],
  providers: [CaseService],
  controllers: [
    CaseController
  ]
})
export class CaseModule {

}
