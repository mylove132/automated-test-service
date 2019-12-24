import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {CaseEntity} from './case.entity';
import {CaseService} from './case.service';
import {CaseController} from './case.controller';
import {CatalogEntity} from '../catalog/catalog.entity';



@Module({
  imports: [TypeOrmModule.forFeature([CaseEntity, CatalogEntity])],
  providers: [CaseService],
  controllers: [
    CaseController
  ]
})
export class CaseModule {

}
