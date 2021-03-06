import { Module} from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';

import { CatalogService } from './catalog.service';
import {CatalogEntity} from "./catalog.entity";
import {PlatformCodeEntity} from "./platformCode.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CatalogEntity, PlatformCodeEntity])],
  providers: [CatalogService],
  controllers: [
    CatalogController
  ]
})
export class CatalogModule {

}
