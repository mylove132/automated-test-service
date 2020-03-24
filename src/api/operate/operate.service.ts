import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {OperateEntity} from "./operate.entity";

@Injectable()
export class OperateService {
  constructor(
    @InjectRepository(OperateEntity)
    private readonly operateRepository: Repository<OperateEntity>,
  ) {
  }
  async createOperate(operateEntity: OperateEntity){
    return await this.operateRepository.save(operateEntity);
  }
}
