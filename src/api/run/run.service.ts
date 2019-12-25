import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseEntity } from '../case/case.entity';
import { RunCaseDto } from './dto/run.dto';
import { CurlService } from '../curl/curl.service';
import { ApiException } from '../../shared/exceptions/api.exception';
import { ApiErrorCode } from '../../shared/enums/api.error.code';

@Injectable()
export class RunService {
  constructor(
    @InjectRepository(CaseEntity)
    private readonly caseRepository: Repository<CaseEntity>,
    private readonly curlService: CurlService
  ) {}

  /**
   * 执行临时的case用例请求
   * @param {runCaseDto}: 请求配置信息
   * @return {Promise<any>}: 发起请求后的响应结果
   */
  async runTempCase(runCaseDto: RunCaseDto): Promise<boolean> {
    const requestData = {
      url: runCaseDto.url,
      method: getRequestMethodTypeString(Number(runCaseDto.type)),
      headers: runCaseDto.header,
      params: runCaseDto.param,
    }
    const result = await this.curlService.makeRequest(requestData).toPromise();
    if (result.result) {
      return true
    } else {
      throw new ApiException('请求失败', ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  }
}


// type转换成method文字
export function getRequestMethodTypeString(type: number): string {
  switch (type) {
    case 0:
        return 'GET';
    case 1:
        return 'POST';
    case 2:
        return 'DELETE';
    case 3:
        return 'DELETE';
    default:
        return 'GET';
  }
}