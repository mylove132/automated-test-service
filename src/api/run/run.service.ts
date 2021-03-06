/* eslint-disable no-prototype-builtins */
import { HttpStatus, Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CaseEntity } from "../case/case.entity";
import { CovertDto, RunCaseDto } from "./dto/run.dto";
import { CurlService } from "../curl/curl.service";
import { EnvService } from "../env/env.service";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { AxiosRequestConfig } from "axios";
import { getAssertObjectValue, getRequestMethodTypeString } from "../../utils";
import { HistoryService } from "../history/history.service";
import * as FormData from "form-data";
import * as request from "request";
import { IRunCaseById } from "./run.interface";
import { TokenEntity } from "../token/token.entity";
import { findTokenById } from "../../datasource/token/token.sql";
import {
  findCaseByAlias,
  findCaseOfAssertTypeAndAssertJudgeById,
  findCaseOfEndpointAndTokenById
} from "../../datasource/case/case.sql";
import { ParamType } from "../../config/base.enum";
import { CommonUtil } from "../../utils/common.util";
import { Logger } from "../../utils/log4js";
import { DynSqlEntity } from "../dyndata/dynsql.entity";
import { querySqlByAlias } from "../../datasource/dyndata/dyndata.sql";


@Injectable()
export class RunService {
  constructor(
    @InjectRepository(CaseEntity)
    private readonly caseRepository: Repository<CaseEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    @InjectRepository(DynSqlEntity)
    private readonly dynSqlEntityRepository: Repository<DynSqlEntity>,
    private readonly curlService: CurlService,
    private readonly historyService: HistoryService,
    private readonly envService: EnvService,
  ) {
  }
  private tmpResult = {};
  /**
   * 执行临时的case用例请求
   * @return {Promise<any>}: 发起请求后的响应结果
   * @param runCaseDto
   */
  async runTempCase(runCaseDto: RunCaseDto): Promise<any> {
    Logger.info(`运行临时接口请求数据：JSON.stringify(runCaseDto)`)
    let resultObj = {};
    resultObj["startTime"] = new Date();
    // 生成请求数据
    let requestData: AxiosRequestConfig = {};
    const headers = await this.parseRequestHeader(runCaseDto);
    const url = this.parseUrl(runCaseDto);
    let data = await this.parseRequestData(runCaseDto, runCaseDto.endpoint);
    runCaseDto.type == "0" ? requestData.params = data : requestData.data = data;
    requestData.method = this.parseRequestMethod(runCaseDto);
    requestData.headers = headers;
    requestData.url = url;
    // 响应结果
    Logger.info(`运行临时接口响应结果JSON.stringify(requestData)`);
    const result = await this.curlService.makeRequest(requestData).toPromise().catch(
      err => {
        throw new  BadRequestException(`执行url--${url}--失败`, err);
      }
    );
    const endTime = new Date();
    resultObj["endTime"] = endTime;
    result.result == null ? resultObj["result"] = null : resultObj["result"] = result.data;
    result.result == null ? resultObj["errMsg"] = null : resultObj["errMsg"] = result;
    return resultObj;
  }

  /**
   * 执行某个具体测试样例接口
   * @return {Promise<any>}: 发起请求后的响应结果
   * @param runCaseById
   */
  async runCaseById(runCaseById: IRunCaseById): Promise<any> {
    let resultList = [];
    Logger.info(`通过ID执行接口ID集合：${runCaseById.caseIds},环境ID：${runCaseById.envId},接口执行者：${runCaseById.executor}`)
    for (let caseId of runCaseById.caseIds) {
      let resultObj = {};
      const startTime = new Date();
      resultObj["startTime"] = startTime;
      const caseObj = await findCaseOfEndpointAndTokenById(this.caseRepository, caseId);
      const endpoint = await this.envService.formatEndpoint(runCaseById.envId, caseObj.endpointObject.endpoint);
      const runCaseDto: RunCaseDto = Object.assign({}, caseObj, {
        endpoint: endpoint,
        type: String(caseObj.type),
        tokenId: caseObj.token != null ? caseObj.token.id : null,
      });
      let requestData: AxiosRequestConfig = {};
      const headers = await this.parseRequestHeader(runCaseDto);
      const url = this.parseUrl(runCaseDto);
      let data = await this.parseRequestData(runCaseDto, endpoint);
      runCaseDto.type == "0" ? requestData.params = data : requestData.data = data;
      requestData.method = this.parseRequestMethod(runCaseDto);
      requestData.headers = headers;
      requestData.url = url;
      Logger.info('接口请求参数:' + JSON.stringify(requestData))
      const result = await this.curlService.makeRequest(requestData).toPromise().catch(
        err => {
          throw new BadRequestException(`执行url--${url}--失败`, err);
        }
      )
      const endTime = new Date();
      resultObj['cas'] = { caseName: caseObj.name, catalogName: caseObj.catalog.name };
      resultObj["endTime"] = endTime;
      const rumTime = endTime.getTime() - startTime.getTime();
      resultObj["rumTime"] = rumTime;
      const res = result.data == '' || result.data == null ? null : JSON.stringify(result.data);
      if (result.result) {
        const tmpResult = result.data == '' || result.data == null ? null : result.data;
        const assert = await this.execAssert(caseId, tmpResult);
        resultObj["result"] = result.data;
        resultObj["status"] = assert["result"];
        resultObj["assert"] = assert;
        resultObj["errMsg"] = null;
        if (caseObj.isFailNotice) {
          if (!assert["result"]) {
            this.curlService.sendDingTalkMessage(
              `接口 ${caseObj.name} 运行失败，期望结果:${caseObj.assertText}
                           期望条件 ${assert["relation"]}
                           实际结果${assert["actual"]} 不符合`);
          }
        }
      } else {
        resultObj["status"] = false;
        resultObj["result"] = null;
        resultObj["errMsg"] = result;
        if (caseObj.isFailNotice) {
          this.curlService.sendDingTalkMessage(`接口 ${caseObj.name} 运行失败，失败内容: ${result}`);
        }
      }
      // 保存历史记录
      const historyData = {
        caseId: caseId,
        status: resultObj["status"] ? 0 : 1,
        executor: runCaseById.executor,
        re: res,
        startTime: startTime,
        endTime: endTime
      };
      await this.historyService.createHistory(historyData).catch(
        err => {
          console.log(err);
          throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
      );

      console.log("接口执行返回结果：" + JSON.stringify(resultObj));
      resultList.push(resultObj);
    }
    return resultList;
  }


  /**
   * 解析请求url
   * @param runCaseDto
   */
  parseUrl(runCaseDto: RunCaseDto) {
    return runCaseDto.endpoint + runCaseDto.path;
  }

  /**
   * 解析请求方法
   * @param runCaseDto
   */
  parseRequestMethod(runCaseDto: RunCaseDto) {
    return getRequestMethodTypeString(Number(runCaseDto.type));
  }

  /**
   * 解析请求头
   * @param runCaseDto
   */
  async parseRequestHeader(runCaseDto: RunCaseDto) {

    //处理头部
    let headers = runCaseDto.header != null ? JSON.parse(runCaseDto.header) : {};
    let contentTypeFlag = false;
    for (const key in headers) {
      if (headers.hasOwnProperty(key) && key.toLocaleLowerCase() === "content-type") contentTypeFlag = true;
    }
    if (runCaseDto.type == "0") {
      headers["content-type"] = "application/x-www-form-urlencoded";
    } else {
      if (!contentTypeFlag) headers["content-type"] = "application/json";
    }
    if (runCaseDto.tokenId) {
      const tokenObj = await findTokenById(this.tokenRepository, runCaseDto.tokenId);
      headers["token"] = tokenObj.token;
    }
    if (runCaseDto.isNeedSign == true) {
      const isProdEnv = runCaseDto.endpoint == "https://oapi.blingabc.com";
      const signHeader = CommonUtil.generateSign(runCaseDto.param, isProdEnv);
      headers["ts"] = signHeader.ts;
      headers["sign"] = signHeader.md5;
    }
    if (runCaseDto.paramType == ParamType.FILE) {
      const form = RunService.generateFileStream("file", JSON.parse(runCaseDto.param)["file"]);
      headers = form.getHeaders();
    }
    return headers;
  }

  /**
   * 解析参数
   * @param runCaseDto
   * @param endpoint
   */
  async parseRequestData(runCaseDto: RunCaseDto, endpoint) {
    if (runCaseDto.paramType == ParamType.FILE) {
      // 将requestData的data转化成文件流
      if (!runCaseDto.param) {
        throw new ApiException("没有正确传入文件地址", ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
      }
      const form = RunService.generateFileStream("file", JSON.parse(runCaseDto.param)["file"]);
      return form;
    } else {
      if (runCaseDto.param) {
        const vParams = JSON.parse(runCaseDto.param);
        return await this.analysisParam(vParams, endpoint);
      }
    }
  }

  /**
   * 解析参数
   * @param param
   * @param endpoint
   */
  private async analysisParam(param, endpoint: string) {
    const paramReg = /\{\{(.+?)\}\}/g;
    var regex2 = /\[(.+?)\]/g;
    for (let paramsKey in param) {
      const value = param[paramsKey];
      if (paramReg.test(value)) {
        const regData = value.replace(paramReg, "$1");
        //匹配参数中的随机数
        if (regData.indexOf("$randomint") != -1) {
          if (regData.indexOf("-") != -1) {
            const limit = regData.split("-")[1];
            if (regex2.test(limit)) {
              const qj = limit.replace(regex2, "$1");
              const min = Number(qj.split(",")[0]);
              const max = Number(qj.split(",")[1]);
              param[paramsKey] = CommonUtil.randomNum(min, max);
            } else {
              throw new ApiException(`参数${param[paramsKey]}不符合格式要求`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            }
          } else {
            param[paramsKey] = Math.random();
          }
        }
        //匹配参数中随机数
        else if (regData.indexOf("$randomstring") != -1) {
          if (regData.indexOf("-") != -1) {
            const length = regData.split("-")[1];
            param[paramsKey] = CommonUtil.randomChar(Number(length));
          } else {
            param[paramsKey] = CommonUtil.randomChar(6);
          }
        }
        //匹配参数中的级联调用
        else if (regData.startsWith("alias") != -1) {
          const regData = value.toString().replace(paramReg, "$1");
          const alias = regData.split(".")[0];
          const dataName = regData.split(".")[1];

          const caseInstance = await findCaseByAlias(this.caseRepository, alias);
          if (!caseInstance) {
            throw new ApiException(`别名:${alias}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
          }
          if (!this.tmpResult[alias]) {
            const runResult = await this.runCaseByCaseInstance(caseInstance, endpoint);
            this.tmpResult[alias] = runResult;
          }
          Logger.info('执行别名结果集合:' + JSON.stringify(this.tmpResult))
          const newVal = regData.substr(alias.length + 1, regData.length - 1).replace(dataName, "data");
          const paramValue = getAssertObjectValue(this.tmpResult[alias], newVal);
          Logger.info(`执行中保存的别名：${alias}, 执行脚本返回的数据：${paramValue})`);
          param[paramsKey] = paramValue;
        }
        // 匹配参数中的数据库语句
        else if (regData.startsWith("sqlAlias") != -1) {
          const sqlObj = await querySqlByAlias(this.dynSqlEntityRepository, regData.split('.')[0]);
          const execSqlResult = await this.curlService.query(sqlObj);
          const field = execSqlResult[regData.split('.')[1]];
          param[paramsKey] = field;
        }
      }
    }
    return param;
  }


  /**
   * 
   * @param caseInstance 递归执行场景接口
   * @param endpoint 
   */
  private async runCaseByCaseInstance(caseInstance: CaseEntity, endpoint: string) {
    const runCaseDto: RunCaseDto = Object.assign({}, caseInstance, {
      endpoint: endpoint,
      type: String(caseInstance.type),
      tokenId: caseInstance.token != null ? caseInstance.token.id : null
    });
    let requestData: AxiosRequestConfig = {};
    const headers = await this.parseRequestHeader(runCaseDto);
    const url = this.parseUrl(runCaseDto);
    let data = await this.parseRequestData(runCaseDto, endpoint);
    runCaseDto.type == "0" ? requestData.params = data : requestData.data = data;
    requestData.method = this.parseRequestMethod(runCaseDto);
    requestData.headers = headers;
    requestData.url = url;
    const result = await this.curlService.makeRequest(requestData).toPromise().catch(
      err => {
        throw new  BadRequestException(`执行url--${url}--失败`, err);
      }
    );
    if (result.result) {
      return result.data;
    } else {
      throw new ApiException(`运行接口：${caseInstance.name}失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
    }
  }


  // 生成文件流
  private static generateFileStream(paramName: string, address: string) {
    const form = new FormData();
    form.append(paramName, request(address));
    return form;
  }

  /**
   * 转换curl请求
   * @param covertDto
   */
  async covertCurl(covertDto: CovertDto) {
    let type: string;
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
    let ht: string;
    if (covertDto.header != null) {
      const header: Map<String, Object> = JSON.parse(covertDto.header);
      header.forEach(
        (k, v) => {
          ht += ` -H ${k}:${v}`;
        }
      );
    }
    let args;
    if (covertDto.args) {
      args = covertDto.args;
    } else {
      args = "";
    }

    let result: string;
    result = `curl -g -i -X ${type} ${covertDto.url} ${ht} -d ${args}`;

    return result;
  }

  /**
   * 处理断言结果
   * @param caseId
   * @param result
   */
  private async execAssert(caseId: number, result: any) {
    const caseObj = await findCaseOfAssertTypeAndAssertJudgeById(this.caseRepository, caseId);
    if (!caseObj)
      throw new ApiException(`caseId: ${caseId} 不存在`, ApiErrorCode.CASELIST_ID_INVALID, HttpStatus.BAD_REQUEST);
    let assertResult = {};
    let execResult: any;
    try {
      execResult = getAssertObjectValue(result, caseObj.assertKey);
    } catch (e) {
      assertResult["assertKey"] = caseObj.assertKey;
      assertResult["relation"] = caseObj.assertJudge.name;
      assertResult["expect"] = caseObj.assertText;
      assertResult["actual"] = null;
      assertResult["result"] = (execResult == caseObj.assertText);
      return assertResult;
    }
    switch (caseObj.assertType.id) {
      case 1:
        switch (caseObj.assertJudge.id) {
          case 1:
            assertResult["assertKey"] = caseObj.assertKey;
            assertResult["relation"] = caseObj.assertJudge.name;
            assertResult["expect"] = caseObj.assertText;
            assertResult["actual"] = execResult;
            assertResult["result"] = (execResult == caseObj.assertText);
            break;
          case 2:
            assertResult["assertKey"] = caseObj.assertKey;
            assertResult["relation"] = caseObj.assertJudge.name;
            assertResult["expect"] = caseObj.assertText;
            assertResult["actual"] = execResult;
            assertResult["result"] = (execResult < caseObj.assertText);
            break;
          case 3:
            assertResult["assertKey"] = caseObj.assertKey;
            assertResult["relation"] = caseObj.assertJudge.name;
            assertResult["expect"] = caseObj.assertText;
            assertResult["actual"] = execResult;
            assertResult["result"] = (execResult <= caseObj.assertText);
            break;
          case 4:
            assertResult["assertKey"] = caseObj.assertKey;
            assertResult["relation"] = caseObj.assertJudge.name;
            assertResult["expect"] = caseObj.assertText;
            assertResult["actual"] = execResult;
            assertResult["result"] = (execResult > caseObj.assertText);
            break;
          case 5:
            assertResult["assertKey"] = caseObj.assertKey;
            assertResult["relation"] = caseObj.assertJudge.name;
            assertResult["expect"] = caseObj.assertText;
            assertResult["actual"] = execResult;
            assertResult["result"] = (execResult >= caseObj.assertText);
            break;
          case 6:
            assertResult["assertKey"] = caseObj.assertKey;
            assertResult["relation"] = caseObj.assertJudge.name;
            assertResult["expect"] = caseObj.assertText;
            assertResult["actual"] = execResult;
            assertResult["result"] = (execResult != caseObj.assertText);
            break;
          case 7:
            assertResult["assertKey"] = caseObj.assertKey;
            assertResult["relation"] = caseObj.assertJudge.name;
            assertResult["expect"] = caseObj.assertText;
            assertResult["actual"] = execResult;
            assertResult["result"] = (execResult.toString().indexOf(caseObj.assertText) != -1);
            break;
          case 8:
            assertResult["assertKey"] = caseObj.assertKey;
            assertResult["relation"] = caseObj.assertJudge.name;
            assertResult["expect"] = caseObj.assertText;
            assertResult["actual"] = execResult;
            assertResult["result"] = (execResult.toString().indexOf(caseObj.assertText) == -1);
            break;
          case 9:
            assertResult["assertKey"] = caseObj.assertKey;
            assertResult["relation"] = caseObj.assertJudge.name;
            assertResult["expect"] = caseObj.assertText;
            assertResult["actual"] = execResult;
            assertResult["result"] = (execResult == null);
            break;
          case 10:
            assertResult["assertKey"] = caseObj.assertKey;
            assertResult["relation"] = caseObj.assertJudge.name;
            assertResult["expect"] = caseObj.assertText;
            assertResult["actual"] = execResult;
            assertResult["result"] = (execResult != null);
            break;
        }
        break;
    }
    return assertResult;
  }
}




