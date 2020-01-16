import { Injectable, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryEntity } from './history.entity';
import { CreateHistoryDto } from './dto/history.dto';
import { CaseEntity } from '../case/case.entity';
import { ApiException } from '../../shared/exceptions/api.exception';
import { ApiErrorCode } from '../../shared/enums/api.error.code';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

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
    historyObj.result = createHistoryDto.re;
    const result = await this.historyRepository.save(historyObj).catch(err => {
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    })
    return result
  }
  /**
   * 获取所有的历史记录列表
   * @param {number, IPaginationOptions}: id, 页码信息
   * @return {Promise<Pagination<HistoryEntity>>}: 历史记录列表
   */
  async findHistoryList(historyPath: string, options: IPaginationOptions): Promise<Pagination<HistoryEntity>> {
    if (!historyPath) {
        const queryBuilder = this.historyRepository.createQueryBuilder('history')
        .leftJoinAndSelect('history.case','case')
        .orderBy('history.createDate', 'DESC');
        return await paginate<HistoryEntity>(queryBuilder, options);
    } else {
        const queryBuilder = this.historyRepository.createQueryBuilder('history')
        .leftJoinAndSelect('history.case','case')
        .where("case.path LIKE :param")
        .setParameters({
            param: '%'+historyPath+'%'
        })
        .orderBy('history.createDate', 'DESC');
        return await paginate<HistoryEntity>(queryBuilder, options);
    }
  }
}
