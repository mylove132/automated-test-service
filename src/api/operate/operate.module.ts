import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {OperateEntity} from "./operate.entity";
import {OperateService} from "./operate.service";
import {OperateController} from "./operate.controller";
import {ExceptionEntity} from "./expection.entity";



@Module({
  imports: [TypeOrmModule.forFeature([OperateEntity,ExceptionEntity])],
  providers: [OperateService],
  controllers: [OperateController],
  exports: [OperateService],
})
export class OperateModule {}
