import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryEntity } from './history.entity';
import { CreateHistoryDto } from './dto/history.dto';
import { CaseEntity } from '../case/case.entity';
import { ApiException } from '../../shared/exceptions/api.exception';
import { ApiErrorCode } from '../../shared/enums/api.error.code';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>,
    @InjectRepository(CaseEntity)
    private readonly caseRepository: Repository<CaseEntity>,
  ) {
  }

  /**
   * 创建历史记录
   * @param {createHistoryDto}: 请求配置信息
   * @return {Promise<any>}: 创建结果
   */
  async createHistory(createHistoryDto: CreateHistoryDto): Promise<HistoryEntity> {
    const historyObj = new HistoryEntity();
    const caseObj = await this.caseRepository.findOne(createHistoryDto.caseId).catch(err => {
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    })
    historyObj.case = caseObj;
    historyObj.status = createHistoryDto.status;
    historyObj.executor = createHistoryDto.executor;
    const result = await this.historyRepository.save(historyObj).catch(err => {
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    })
    return result
  }
}