import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseEntity } from '../case/case.entity';
import { RunCaseDto, RunCaseByIdDto } from './dto/run.dto';
import { CurlService } from '../curl/curl.service';
import { ApiException } from '../../shared/exceptions/api.exception';
import { ApiErrorCode } from '../../shared/enums/api.error.code';
import { AxiosRequestConfig } from 'axios';
import { getRequestMethodTypeString, generateEndpointByEnv } from '../../utils'
import { EndpointEntity } from '../env/endpoint.entity';
import { EnvEntity } from '../env/env.entity';

@Injectable()
export class RunService {
  constructor(
    @InjectRepository(CaseEntity)
    private readonly caseRepository: Repository<CaseEntity>,
    @InjectRepository(EnvEntity)
    private readonly envRepository: Repository<EnvEntity>,
    @InjectRepository(EndpointEntity)
    private readonly endpointgRepository: Repository<EndpointEntity>,

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
    if (caseObj instanceof CaseEntity) {
      const endpoint = generateEndpointByEnv(caseObj.endpointObject.envs[0].name, caseObj.endpointObject.endpoint)
      const requestBaseData: RunCaseDto = Object.assign({}, caseObj, {
        endpoint: endpoint,
        type: String(caseObj.type),
      });
      const requestData = this.generateRequestData(requestBaseData);
      // const requestData = {};
      console.log(requestData)
      const result = await this.curlService.makeRequest(requestData).toPromise();
      console.log(result)
      if (result.result) {
        return result.data
      } else {
        throw new ApiException('请求失败', ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    } else {
      throw new ApiException('没有找到该样例', ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
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

}




