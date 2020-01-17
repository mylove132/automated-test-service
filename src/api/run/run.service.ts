import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseEntity } from '../case/case.entity';
import { CaselistEntity } from '../caselist/caselist.entity';
import {RunCaseDto, RunCaseByIdDto, RunCaseListByIdDto, CovertDto} from './dto/run.dto';
import { CurlService } from '../curl/curl.service';
import { EnvService } from '../env/env.service';
import { ApiException } from '../../shared/exceptions/api.exception';
import { ApiErrorCode } from '../../shared/enums/api.error.code';
import { AxiosRequestConfig } from 'axios';
import { getRequestMethodTypeString } from '../../utils'
import { HistoryService } from '../history/history.service';
import { forkJoin } from 'rxjs';
import * as FormData from 'form-data';
import * as request from 'request';
import {IRunCaseById, IRunCaseList} from './run.interface';
import { map } from 'rxjs/operators';


@Injectable()
export class RunService {
  constructor(
    @InjectRepository(CaseEntity)
    private readonly caseRepository: Repository<CaseEntity>,
    @InjectRepository(CaselistEntity)
    private readonly caseListRepository: Repository<CaselistEntity>,
    private readonly curlService: CurlService,
    private readonly historyService: HistoryService,
    private readonly envService: EnvService,
  ) {}

  /**
   * 执行临时的case用例请求
   * @param {runCaseDto}: 请求配置信息
   * @return {Promise<any>}: 发起请求后的响应结果
   */
  async runTempCase(runCaseDto: RunCaseDto): Promise<any> {
    // 生成请求数据
    const requestData = this.generateRequestData(runCaseDto);
    let token;
    if (runCaseDto.token != null && runCaseDto.token != ""){
      token = runCaseDto.token;
    }
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
  async runCaseById(runCaseById: IRunCaseById): Promise<any> {
    let resultList = [];
    for (let caseId of runCaseById.caseIds) {
      let resultObj = {};
      const startTime = new Date();
      resultObj['startTime'] = startTime;
      const caseObj = await this.caseRepository
          .createQueryBuilder('case')
          .select()
          .leftJoinAndSelect("case.endpointObject", 'endpointObj')
          .where('case.id = :id', {id: caseId})
          .getOne()
          .catch(
              err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
              }
          );
      if (caseObj instanceof CaseEntity) {
        const endpoint = await this.envService.formatEndpoint(runCaseById.envId, caseObj.endpointObject.endpoint);
        const requestBaseData: RunCaseDto = Object.assign({}, caseObj, {
          endpoint: endpoint,
          type: String(caseObj.type),
        });
        resultObj['caseId'] = caseId;
        resultObj['expect'] = caseObj.assertText;
        console.log("requestBaseData", requestBaseData)
        const requestData = this.generateRequestData(requestBaseData);
        let token;
        if (runCaseById.token != null && runCaseById.token != ''){
          token = runCaseById.token;
          requestData.headers['token'] = token
        }
        console.log(requestData)
        const result = await this.curlService.makeRequest(requestData).toPromise();
        const endTime = new Date();
        resultObj['endTime'] = endTime;
        const rumTime = endTime.getTime() - startTime.getTime();
        resultObj['rumTime'] = rumTime;
        const res = JSON.stringify(result.data);
        if (result.result){
          resultObj['result'] = result.data;
        }else {
          resultObj['result'] = null;
          resultObj['errMsg'] = result;
        }
        console.log(res)
        // 保存历史记录
        const historyData = {
          caseId: caseId,
          status: result.result ? 0 : 1,
          executor: 0,
          re: res,
          startTime: startTime,
          endTime: endTime
        };
        console.log(historyData);
        await this.historyService.createHistory(historyData).catch(
            err => {
              console.log(err);
              throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )

      }
      resultList.push(resultObj);
    }
    return resultList;
  }

  /**
   * 执行测试用例中的所有接口
   * @param {RunCaseListByIdDto}: 用例Id及环境Id
   * @return {Promise<any>}: 发起请求后的响应结果
   */
  async runCaseListById(runcaseList: IRunCaseList):Promise<any[]> {
    const caseList = await this.caseListRepository
    .createQueryBuilder('caselist')
    .where('caselist.id = :id', {id: runcaseList.caseListId})
    .leftJoinAndSelect('caselist.cases','cases')
    .leftJoinAndSelect('cases.endpointObject','end')
    .getOne()
    .catch(
      err => {
          console.log(err);
          throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    );
    if (!caseList) {
      throw new ApiException('未找到相关用例', ApiErrorCode.CASELIST_ID_INVALID, HttpStatus.OK);
    }
    const caseIdList = []
    const startTime = new Date();
    const requestAsyncList = caseList.cases.map(async v => {
      if (v instanceof CaseEntity) {
        const endpoint = await this.envService.formatEndpoint(runcaseList.envId, v.endpointObject.endpoint)
        const requestBaseData: RunCaseDto = Object.assign({}, v, {
          token: '',
          endpoint: endpoint,
          type: String(v.type),
        });
        caseIdList.push(v.id);
        const requestData = this.generateRequestData(requestBaseData);
        return this.curlService.makeRequest(requestData);
      } else {
        throw new ApiException('样例中接口未找到', ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    })
    const requestList = await Promise.all(requestAsyncList)
    const endTime = new Date();
    const resultList = await forkJoin(requestList).pipe(map(res => {
      res.forEach(async (value, index) => {
        // 保存历史记录
        const historyData = {
          caseId: caseIdList[index].id,
          status: value.result ? 0 : 1,
          executor: runcaseList.executor || 0,
          re: JSON.stringify(value.data),
          startTime: startTime,
          endTime: endTime
        }
        await this.historyService.createHistory(historyData);
      })
      return res
    })).toPromise();
    return resultList
  }



  // 生成请求参数
  private generateRequestData(runCaseDto: RunCaseDto): AxiosRequestConfig {
    let headers = runCaseDto.header ? JSON.parse(runCaseDto.header) : {};
    let contentTypeFlag = false
    for (const key in headers) {
      if (headers.hasOwnProperty(key) && key.toLocaleLowerCase() === 'content-type') {
        contentTypeFlag = true
      }
    }
    if (!contentTypeFlag) headers['content-type'] = 'application/json'; // 默认为json
    const requestData: AxiosRequestConfig = {
      url: runCaseDto.endpoint + runCaseDto.path,
      method: getRequestMethodTypeString(Number(runCaseDto.type)),
      headers: headers
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
        requestData.params = JSON.parse(runCaseDto.param)
      } else {
        requestData.data = JSON.parse(runCaseDto.param)
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

  async covertCurl(covertDto: CovertDto){
    let type;
    switch (covertDto.type) {
      case 0:
        type = "GET";
        break;
      case 1:
        type = "POST";
        break;
      case 2:
        type = "DELETE";
        break;
      default:
        type = "GET";
    }
    let ht;
    if (covertDto.header != null){
      const header: Map<String, Object> = JSON.parse(covertDto.header);
      header.forEach(
          (k, v) => {
            ht += ` -H ${k}:${v}`
          }
      )
    }
    let args;
    if (covertDto.args){
      args = covertDto.args;
    }else {
      args = "";
    }

    let result;
    result = `curl -g -i -X ${type} ${covertDto.url} ${ht} -d ${args}`;

    return result;
  }
}




