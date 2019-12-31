import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseEntity } from '../case/case.entity';
import { CaselistEntity } from '../caselist/caselist.entity';
import { RunCaseDto, RunCaseByIdDto, RunCaseListByIdDto } from './dto/run.dto';
import { CurlService } from '../curl/curl.service';
import { ApiException } from '../../shared/exceptions/api.exception';
import { ApiErrorCode } from '../../shared/enums/api.error.code';
import { AxiosRequestConfig } from 'axios';
import { getRequestMethodTypeString, generateEndpointByEnv } from '../../utils'
import { forkJoin } from 'rxjs';
import * as FormData from 'form-data';
import * as request from 'request';

@Injectable()
export class RunService {
  constructor(
    @InjectRepository(CaseEntity)
    private readonly caseRepository: Repository<CaseEntity>,
    @InjectRepository(CaselistEntity)
    private readonly caseListRepository: Repository<CaselistEntity>,
    private readonly curlService: CurlService
  ) {}

  /**
   * 执行临时的case用例请求
   * @param {runCaseDto}: 请求配置信息
   * @return {Promise<any>}: 发起请求后的响应结果
   */
  async runTempCase(runCaseDto: RunCaseDto): Promise<any> {
    // 生成请求数据
    const requestData = this.generateRequestData(runCaseDto);

    // 响应结果
    const result = await this.curlService.makeRequest(requestData).toPromise();
    console.log(result)
    if (result.result) {
      return result.data
    } else {
      throw new ApiException('请求失败', ApiErrorCode.RUN_INTERFACE_FAIL, HttpStatus.OK);
    }
  }

  /**
   * 执行某个具体测试样例接口
   * @param {RunCaseByIdDto}: 接口Id及环境Id
   * @return {Promise<any>}: 发起请求后的响应结果
   */
  async runCaseById(runCaseByIdDto: RunCaseByIdDto): Promise<any> {
    const caseObj = await this.caseRepository
    .createQueryBuilder('case')
    .select()
    .leftJoinAndSelect("case.endpointObject", 'endpointObj')
    .where('case.id = :id', {id: runCaseByIdDto.caseId})
    .leftJoinAndSelect("endpointObj.envs", 'envObj')
    .where('envObj.id = :id', {id: runCaseByIdDto.envId})
    .getOne()
    .catch(
      err => {
          console.log(err);
          throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    );
    console.log(caseObj);
    if (caseObj instanceof CaseEntity) {
      const endpoint = generateEndpointByEnv(caseObj.endpointObject.envs[0].name, caseObj.endpointObject.endpoint)
      const requestBaseData: RunCaseDto = Object.assign({}, caseObj, {
        endpoint: endpoint,
        type: String(caseObj.type),
      });
      const requestData = this.generateRequestData(requestBaseData);
      const result = await this.curlService.makeRequest(requestData).toPromise();
      if (result.result) {
        return result.data
      } else {
        throw new ApiException('请求失败', ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    } else {
      throw new ApiException('没有找到该接口', ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  }

  /**
   * 执行测试用例中的所有接口
   * @param {RunCaseListByIdDto}: 用例Id及环境Id
   * @return {Promise<any>}: 发起请求后的响应结果
   */
  async runCaseListById(runCaseListByIdDto: RunCaseListByIdDto):Promise<any[]> {
    const caseList = await this.caseListRepository
    .createQueryBuilder('caselist')
    .where('caselist.id = :id', {id: runCaseListByIdDto.caseListId})
    .leftJoinAndSelect('caselist.cases','cases')
    .leftJoinAndSelect('cases.endpointObject','end')
    .leftJoinAndSelect('end.envs','envObj')
    .where('envObj.id = :id', {id: runCaseListByIdDto.envId})
    .getOne()
    .catch(
      err => {
          console.log(err);
          throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    );
    const requestList = caseList.cases.map(v => {
      if (v instanceof CaseEntity) {
        const endpoint = generateEndpointByEnv(v.endpointObject.envs[0].name, v.endpointObject.endpoint)
        const requestBaseData: RunCaseDto = Object.assign({}, v, {
          endpoint: endpoint,
          type: String(v.type),
        });
        const requestData = this.generateRequestData(requestBaseData);
        return this.curlService.makeRequest(requestData);
      } else {
        throw new ApiException('样例中接口未找到', ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    })
    const resultList = await forkJoin(requestList).toPromise();
    return resultList
  }



  // 生成请求参数
  private generateRequestData(runCaseDto: RunCaseDto): AxiosRequestConfig {
    const requestData: AxiosRequestConfig = {
      url: runCaseDto.endpoint + runCaseDto.path,
      method: getRequestMethodTypeString(Number(runCaseDto.type)),
      headers: runCaseDto.header
    }
    // 判断是否是上传文件
    if (runCaseDto.paramType == '1') {
      // 将requestData的data转化成文件流
      if (!runCaseDto.param) {
        throw new ApiException('没有正确传入文件地址', ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
      }
      const form = this.generateFileStream('file', JSON.parse(runCaseDto.param)['file']);
      requestData.data = form;
      requestData.headers = form.getHeaders();
    } else {
      // 如果为get方法，则参数为params，否则为data
      if (runCaseDto.type === '0') {
        requestData.params = runCaseDto.param
      } else {
        requestData.data = runCaseDto.param
      }
    }
    return requestData
  }

  // 生成文件流
  private generateFileStream(paramName: string, address: string) {
    const form = new FormData();
    form.append(paramName, request(address))
    return form
  }
}




