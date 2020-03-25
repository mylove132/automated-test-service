import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {OperateEntity} from "./operate.entity";
import {ExceptionEntity} from "./expection.entity";

@Injectable()
export class OperateService {
  constructor(
    @InjectRepository(OperateEntity)
    private readonly operateRepository: Repository<OperateEntity>,
    @InjectRepository(ExceptionEntity)
    private readonly exceptionRepository: Repository<ExceptionEntity>,
  ) {
  }
  async createOperate(operateEntity: OperateEntity){
    return await this.operateRepository.save(operateEntity);
  }

    async createException(exceptionEntity: ExceptionEntity){
        return await this.exceptionRepository.save(exceptionEntity);
    }
}
