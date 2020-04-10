import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CaseEntity } from "../case/case.entity";
import { CaselistEntity } from "../caselist/caselist.entity";
import { CovertDto, RunCaseDto, RunSceneDto } from "./dto/run.dto";
import { CurlService } from "../curl/curl.service";
import { EnvService } from "../env/env.service";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { AxiosRequestConfig } from "axios";
import { getAssertObjectValue, getRequestMethodTypeString } from "../../utils";
import { HistoryService } from "../history/history.service";
import { forkJoin } from "rxjs";
import * as FormData from "form-data";
import * as request from "request";
import { IRunCaseById, IRunCaseList } from "./run.interface";
import { map, single } from "rxjs/operators";
import { SceneEntity } from "../scene/scene.entity";
import { CommonUtil } from "../../utils/common.util";
import { TokenEntity } from "../token/token.entity";
import { findTokenById } from "../../datasource/token/token.sql";
import { findCaseOfEndpointAndTokenById } from "../../datasource/case/case.sql";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { Executor, ParamType } from "../../config/base.enum";


@Injectable()
export class RunService {
  constructor(
    @InjectRepository(CaseEntity)
    private readonly caseRepository: Repository<CaseEntity>,
    @InjectRepository(SceneEntity)
    private readonly sceneRepository: Repository<SceneEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    @InjectRepository(CaselistEntity)
    private readonly caseListRepository: Repository<CaselistEntity>,
    private readonly curlService: CurlService,
    private readonly historyService: HistoryService,
    private readonly envService: EnvService,
    @InjectQueue("dingdingProcessor") private readonly sendMessageQueue: Queue
  ) {
  }

  /**
   * 执行临时的case用例请求
   * @return {Promise<any>}: 发起请求后的响应结果
   * @param runCaseDto
   */
  async runTempCase(runCaseDto: RunCaseDto): Promise<any> {
    let resultObj = {};
    resultObj["startTime"] = new Date();
    // 生成请求数据
    const requestData = this.generateRequestData(runCaseDto);
    if (runCaseDto.tokenId) {
      const tokenObj = await findTokenById(this.tokenRepository, runCaseDto.tokenId);
      requestData.headers["token"] = tokenObj.token;
    }
    // 响应结果
    const result = await this.curlService.makeRequest(requestData).toPromise();
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
    for (let caseId of runCaseById.caseIds) {
      let resultObj = {};
      const startTime = new Date();
      resultObj["startTime"] = startTime;
      const caseObj = await findCaseOfEndpointAndTokenById(this.caseRepository, caseId);
      if (caseObj instanceof CaseEntity) {
        const endpoint = await this.envService.formatEndpoint(runCaseById.envId, caseObj.endpointObject.endpoint);
        const requestBaseData: RunCaseDto = Object.assign({}, caseObj, {
          endpoint: endpoint,
          type: String(caseObj.type)
        });
        resultObj["caseId"] = caseId;
        resultObj["caseName"] = caseObj.name;
        const requestData = this.generateRequestData(requestBaseData);

        let token;
        if (caseObj.token != null) {
          token = caseObj.token.token;
          requestData.headers["token"] = token;
        }
        const result = await this.curlService.makeRequest(requestData).toPromise();

        const endTime = new Date();
        resultObj["endTime"] = endTime;
        const rumTime = endTime.getTime() - startTime.getTime();
        resultObj["rumTime"] = rumTime;
        const res = JSON.stringify(result.data);
        if (result.result) {
          const assert = await this.execAssert(caseId, result.data);
          resultObj["result"] = result.data;
          resultObj["status"] = assert["result"];
          resultObj["assert"] = assert;
          resultObj["errMsg"] = null;
          if (caseObj.isFailNotice) {
            if (!assert["result"]) {
              this.sendMessageQueue.add("sendMessage",
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
            this.sendMessageQueue.add("sendMessage", `接口 ${caseObj.name} 运行失败，失败内容: ${result}`);
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

      }
      console.log("接口执行返回结果：" + JSON.stringify(resultObj));
      resultList.push(resultObj);
    }
    return resultList;
  }

  /**
   *
   */
  async runCaseId(caseId, envId, token, isDenpenceParam = false, param = null, executor: Executor) {
    let resultObj = {};
    const startTime = new Date();
    resultObj["startTime"] = startTime;
    const caseObj = await this.caseRepository
      .createQueryBuilder("case")
      .select()
      .leftJoinAndSelect("case.endpointObject", "endpointObj")
      .where("case.id = :id", { id: caseId })
      .getOne()
      .catch(
        err => {
          console.log(err);
          throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
      );
    if (isDenpenceParam) {
      caseObj.param = param;
    }
    if (caseObj instanceof CaseEntity) {
      const endpoint = await this.envService.formatEndpoint(envId, caseObj.endpointObject.endpoint);
      const requestBaseData: RunCaseDto = Object.assign({}, caseObj, {
        endpoint: endpoint,
        type: String(caseObj.type)
      });
      resultObj["caseId"] = caseId;
      resultObj["caseName"] = caseObj.name;
      console.log("requestBaseData", requestBaseData);
      const requestData = this.generateRequestData(requestBaseData);
      if (token != null && token != "") {
        requestData.headers["token"] = token;
      }
      const result = await this.curlService.makeRequest(requestData).toPromise();
      const endTime = new Date();
      resultObj["endTime"] = endTime;
      const rumTime = endTime.getTime() - startTime.getTime();
      resultObj["rumTime"] = rumTime;
      const res = JSON.stringify(result.data);
      if (result.result) {
        const assert = await this.execAssert(caseId, result.data);
        resultObj["result"] = result.data;
        resultObj["status"] = assert["result"];
        resultObj["assert"] = assert;
        resultObj["errMsg"] = null;
      } else {
        resultObj["status"] = false;
        resultObj["result"] = null;
        resultObj["errMsg"] = result;
      }
      // 保存历史记录
      const historyData = {
        caseId: caseId,
        status: resultObj["status"] ? 0 : 1,
        executor: executor,
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
      );
      if (result.result) {
        return res;
      } else {
        return null;
      }
    }
  }

  /**
   * 执行测试用例中的所有接口
   * @return {Promise<any>}: 发起请求后的响应结果
   * @param runcaseList
   */
  async runCaseListById(runcaseList: IRunCaseList): Promise<any[]> {
    const caseList = await this.caseListRepository
      .createQueryBuilder("caselist")
      .where("caselist.id = :id", { id: runcaseList.caseListId })
      .leftJoinAndSelect("caselist.cases", "cases")
      .leftJoinAndSelect("cases.endpointObject", "end")
      .getOne()
      .catch(
        err => {
          console.log(err);
          throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
      );
    if (!caseList) {
      throw new ApiException("未找到相关用例", ApiErrorCode.CASELIST_ID_INVALID, HttpStatus.OK);
    }
    const caseIdList = [];
    const startTime = new Date();
    const requestAsyncList = caseList.cases.map(async v => {
      if (v instanceof CaseEntity) {
        const endpoint = await this.envService.formatEndpoint(runcaseList.envId, v.endpointObject.endpoint);
        const requestBaseData: RunCaseDto = Object.assign({}, v, {
          token: "",
          endpoint: endpoint,
          type: String(v.type)
        });
        caseIdList.push(v.id);
        const requestData = this.generateRequestData(requestBaseData);
        return this.curlService.makeRequest(requestData);
      } else {
        throw new ApiException("样例中接口未找到", ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    });
    const requestList = await Promise.all(requestAsyncList);
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
        };
        await this.historyService.createHistory(historyData);
      });
      return res;
    })).toPromise();
    return resultList;
  }


  // 生成请求参数
  private generateRequestData(runCaseDto: RunCaseDto): AxiosRequestConfig {
    let headers: {};
    if (runCaseDto.header) {
      headers = JSON.parse(runCaseDto.header);
    } else {
      headers = {};
    }
    let contentTypeFlag = false;
    for (const key in headers) {
      if (headers.hasOwnProperty(key) && key.toLocaleLowerCase() === "content-type") {
        contentTypeFlag = true;
      }
    }
    if (runCaseDto.type == "0") {
      headers["content-type"] = "application/x-www-form-urlencoded";
    } else {
      if (!contentTypeFlag) headers["content-type"] = "application/json";
    }

    if (runCaseDto.isNeedSign == true){
      const isProdEnv = runCaseDto.endpoint == "https://oapi.blingabc.com";
      const signHeader = CommonUtil.generateSign(runCaseDto.param, isProdEnv);
      headers['ts'] = signHeader.ts;
      headers['sign'] = signHeader.md5;
    }
    const requestData: AxiosRequestConfig = {
      url: runCaseDto.endpoint + runCaseDto.path,
      method: getRequestMethodTypeString(Number(runCaseDto.type)),
      headers: headers
    };
    // 判断是否是上传文件
    if (runCaseDto.paramType == ParamType.FILE) {
      // 将requestData的data转化成文件流
      if (!runCaseDto.param) {
        throw new ApiException("没有正确传入文件地址", ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
      }
      const form = this.generateFileStream("file", JSON.parse(runCaseDto.param)["file"]);
      requestData.data = form;
      requestData.headers = form.getHeaders();
    } else {
      // 如果为get方法，则参数为params，否则为data
      if (runCaseDto.type === "0") {
        const vParams = JSON.parse(runCaseDto.param);
        requestData.params = this.analysisParam(vParams);
      } else {
        const tmpParam = JSON.parse(runCaseDto.param);
        requestData.data = this.analysisParam(tmpParam);
      }
    }
    return requestData;
  }

  private analysisParam(param) {
    const paramReg = /\{\{(.+?)\}\}/g;
    var regex2 = /\[(.+?)\]/g;
    for (let paramsKey in param) {
      if (paramReg.test(param[paramsKey])) {
        const regData = param[paramsKey].replace(paramReg, "$1");
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
        } else if (regData.indexOf("$randomstring") != -1) {
          if (regData.indexOf("-") != -1) {
            const length = regData.split("-")[1];
            param[paramsKey] = CommonUtil.randomChar(Number(length));
          } else {
            param[paramsKey] = CommonUtil.randomChar(6);
          }
        }
      }
    }
    return param;
  }

  /**
   * 运行场景
   * @param runSceneDto
   */
  async runScene(runSceneDto: RunSceneDto) {
    const scene = await this.sceneRepository.findOne(runSceneDto.sceneId).catch(
      err => {
        console.log(err);
        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    );
    if (!scene) {
      throw new ApiException(`场景ID ${runSceneDto.sceneId}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
    }
    let caseObjList = [];
    const caseJson = JSON.parse(scene.dependenceCaseJson);

    for (let caseJ of caseJson) {
      let caseId = caseJ.caseId;
      const caseObj = await this.caseRepository.findOne(caseId).catch(
        err => {
          console.log(err);
          throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
      );
      const index = caseJ.index;
      const isDependenceParam = caseJ.isDependenceParam;
      const caseInstance = { index: index, case: caseObj, isDependenceParam: isDependenceParam };
      caseObjList.push(caseInstance);
    }
    let resultList = [];
    let resultMap = {};
    const paramReg = /\{\{(.+?)\}\}/g;
    const cases = caseObjList.sort(CommonUtil.compare("index"));
    for (let caseObj of cases) {
      const alias = caseObj.case.alias;
      if (caseObj.isDependenceParam) {
        const paramJson = JSON.parse(caseObj.case.param);
        for (let pJson in paramJson) {
          const value = paramJson[pJson];
          if (paramReg.test(value)) {
            const regData = value.toString().replace(paramReg, "$1");
            const alias = regData.split(".")[0];
            const newVal = regData.replace(alias, "data");
            const paramValue = getAssertObjectValue(JSON.parse(resultMap[alias]), newVal);
            paramJson[pJson] = paramValue;
          }
        }
        caseObj.case.param = JSON.stringify(paramJson);
        const result = await this.runCaseId(caseObj.case.id, runSceneDto.envId, runSceneDto.token, true, caseObj.case.param, runSceneDto.executor);
        if (result == null) {
          throw new ApiException(`运行接口ID:${caseObj.case.id}失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        resultMap[alias] = result;
        resultList.push(
          { id: caseObj.case.id, result: result }
        );
      } else {
        const result = await this.runCaseId(caseObj.case.id, runSceneDto.envId, runSceneDto.token, false, caseObj.case.param, runSceneDto.executor);
        if (result == null) {
          throw new ApiException(`运行接口ID:${caseObj.case.id}失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        resultMap[alias] = result;
        resultList.push(
          { id: caseObj.case.id, result: result }
        );
      }

    }
    return resultList;
  }


  // 生成文件流
  private generateFileStream(paramName: string, address: string) {
    const form = new FormData();
    form.append(paramName, request(address));
    return form;
  }

  /**
   * 转换curl请求
   * @param covertDto
   */
  async covertCurl(covertDto: CovertDto) {
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

    let result;
    result = `curl -g -i -X ${type} ${covertDto.url} ${ht} -d ${args}`;

    return result;
  }

  /**
   * 处理断言结果
   * @param caseId
   * @param result
   */
  private async execAssert(caseId, result) {

    const caseObj = await this.caseRepository.createQueryBuilder("case").where("case.id = :id", { id: caseId }).leftJoinAndSelect("case.assertType", "assertType").leftJoinAndSelect("case.assertJudge", "assertJudge").getOne().catch(
      err => {
        console.log(err);
        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    );
    if (!caseObj) {
      throw new ApiException(`caseId: ${caseId} 不存在`, ApiErrorCode.CASELIST_ID_INVALID, HttpStatus.BAD_REQUEST);
    }
    /**
     * 处理请求结果
     */
    let assertResult = {};
    let execResult;
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
    execResult = execResult ? execResult : null;
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
        }
        break;
    }
    return assertResult;
  }
}




