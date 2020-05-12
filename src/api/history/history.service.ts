import { Injectable, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryEntity } from './history.entity';
import { CreateHistoryDto } from './dto/history.dto';
import { CaseEntity } from '../case/case.entity';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import {findCaseById} from "../../datasource/case/case.sql";
import {findHistoryByPath, saveHistory} from "../../datasource/history/history.sql";

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
    const caseObj = await findCaseById(this.caseRepository, createHistoryDto.caseId);
    historyObj.case = caseObj;
    historyObj.status = createHistoryDto.status;
    historyObj.executor = createHistoryDto.executor;
    historyObj.result = createHistoryDto.re;
    historyObj.startTime = createHistoryDto.startTime;
    historyObj.endTime = createHistoryDto.endTime;
    return await saveHistory(this.historyRepository, historyObj);
  }
  /**
   * 获取所有的历史记录列表
   * @param {number, IPaginationOptions}: id, 页码信息
   * @return {Promise<Pagination<HistoryEntity>>}: 历史记录列表
   */
  async findHistoryListService(historyPath: string, options: IPaginationOptions): Promise<Pagination<HistoryEntity>> {
      const queryBuilder = await findHistoryByPath(this.historyRepository, historyPath);
        return await paginate<HistoryEntity>(queryBuilder, options);
  }
}
