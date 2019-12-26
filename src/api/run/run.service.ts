import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseEntity } from '../case/case.entity';
import { RunCaseDto } from './dto/run.dto';
import { CurlService } from '../curl/curl.service';
import { ApiException } from '../../shared/exceptions/api.exception';
import { ApiErrorCode } from '../../shared/enums/api.error.code';
import { AxiosRequestConfig } from 'axios';

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
  async runTempCase(runCaseDto: RunCaseDto): Promise<any> {
    const requestData: AxiosRequestConfig = {
      url: runCaseDto.url,
      method: getRequestMethodTypeString(Number(runCaseDto.type)),
      headers: runCaseDto.header
    }
    // 如果为get方法，则参数为params，否则为data
    if (runCaseDto.type === '0') {
      requestData.params = runCaseDto.param
    } else {
      requestData.data = runCaseDto.param
    }
    const result = await this.curlService.makeRequest(requestData).toPromise();
    if (result.result) {
      return result.data
    } else {
      throw new ApiException('请求失败', ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  }

  /**
   * 执行某个具体测试样例接口
   * @param {id}: 样例Id
   * @return {Promise<any>}: 发起请求后的响应结果
   */
  async runCaseById(id: number): Promise<any> {
    const caseObj = await this.caseRepository.findOne(id);
    if (caseObj instanceof CaseEntity) {
      const requestData: AxiosRequestConfig = {
        url: caseObj.url,
        method: getRequestMethodTypeString(Number(caseObj.type)),
        headers: caseObj.header,
      }
      // 如果为get方法，则参数为params，否则为data
      if (caseObj.type === 0) {
        requestData.params = caseObj.param
      } else {
        requestData.data = caseObj.param
      }
      const result = await this.curlService.makeRequest(requestData).toPromise();
      if (result.result) {
        return result.data
      } else {
        throw new ApiException('请求失败', ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    } else {
      throw new ApiException('没有找到该样例', ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
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
        return 'PUT';
    default:
        return 'GET';
  }
}

