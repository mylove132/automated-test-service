import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SceneService } from './scene.service';
import {CatalogEntity} from "../catalog/catalog.entity";
import {SceneEntity} from "./scene.entity";
import {SceneController} from "./scene.controller";
import { CaseEntity } from "../case/case.entity";


@Module({
  imports: [TypeOrmModule.forFeature([CatalogEntity, SceneEntity, CaseEntity])],
  providers: [SceneService],
  controllers: [SceneController],
  exports: [SceneService],
})
export class SceneModule {}
