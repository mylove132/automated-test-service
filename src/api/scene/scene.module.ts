import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SceneService } from './scene.service';
import {CatalogEntity} from "../catalog/catalog.entity";
import {SceneEntity} from "./scene.entity";
import {SceneController} from "./scene.controller";


@Module({
  imports: [TypeOrmModule.forFeature([CatalogEntity, SceneEntity])],
  providers: [SceneService],
  controllers: [SceneController],
  exports: [SceneService],
})
export class SceneModule {}
