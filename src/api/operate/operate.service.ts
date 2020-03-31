import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {OperateEntity} from "./operate.entity";
import {ExceptionEntity} from "./expection.entity";
import {saveException, saveOperate} from "../../datasource/operate/operate.sql";

@Injectable()
export class OperateService {
  constructor(
    @InjectRepository(OperateEntity)
    private readonly operateRepository: Repository<OperateEntity>,
    @InjectRepository(ExceptionEntity)
    private readonly exceptionRepository: Repository<ExceptionEntity>,
  ) {
  }

    /**
     * 创建操作记录
     * @param operateEntity
     */
  async createOperate(operateEntity: OperateEntity){
    return await saveOperate(this.operateRepository, operateEntity);
  }


    /**
     * 创建异常记录
     * @param exceptionEntity
     */
    async createException(exceptionEntity: ExceptionEntity){
        return await saveException(this.exceptionRepository, exceptionEntity);
    }
}
