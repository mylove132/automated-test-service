import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CaseEntity} from '../case/case.entity';
import {CaselistEntity} from '../caselist/caselist.entity';
import {CovertDto, RunCaseByIdDto, RunCaseDto, RunCaseListByIdDto, RunSceneDto} from './dto/run.dto';
import {CurlService} from '../curl/curl.service';
import {EnvService} from '../env/env.service';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {AxiosRequestConfig} from 'axios';
import {getAssertObjectValue, getRequestMethodTypeString} from '../../utils'
import {HistoryService} from '../history/history.service';
import {forkJoin} from 'rxjs';
import * as FormData from 'form-data';
import * as request from 'request';
import {IRunCaseById, IRunCaseList} from './run.interface';
import {map} from 'rxjs/operators';
import {SceneEntity} from "../scene/scene.entity";
import {CommonUtil} from "../../util/common.util";


@Injectable()
export class RunService {
    constructor(
        @InjectRepository(CaseEntity)
        private readonly caseRepository: Repository<CaseEntity>,
        @InjectRepository(SceneEntity)
        private readonly sceneRepository: Repository<SceneEntity>,
        @InjectRepository(CaselistEntity)
        private readonly caseListRepository: Repository<CaselistEntity>,
        private readonly curlService: CurlService,
        private readonly historyService: HistoryService,
        private readonly envService: EnvService,
    ) {
    }

    /**
     * 执行临时的case用例请求
     * @param {runCaseDto}: 请求配置信息
     * @return {Promise<any>}: 发起请求后的响应结果
     */
    async runTempCase(runCaseDto: RunCaseDto): Promise<any> {
        let resultObj = {};
        const startTime = new Date();
        resultObj['startTime'] = startTime;
        // 生成请求数据
        const requestData = this.generateRequestData(runCaseDto);
        let token;
        if (runCaseDto.token != null && runCaseDto.token != "") {
            token = runCaseDto.token;
            requestData.headers['token'] = token
        }
        // 响应结果
        const result = await this.curlService.makeRequest(requestData).toPromise();
        const endTime = new Date();
        resultObj['endTime'] = endTime;
        console.log(result)
        if (result.result) {
            resultObj['result'] = result.data;
            resultObj['errMsg'] = null;
        } else {
            resultObj['result'] = null;
            resultObj['errMsg'] = result;
        }
        return resultObj;
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
                resultObj['caseName'] = caseObj.name;
                console.log("requestBaseData", requestBaseData)
                const requestData = this.generateRequestData(requestBaseData);
                let token;
                if (runCaseById.token != null && runCaseById.token != '') {
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
                if (result.result) {
                    const assert = await this.execAssert(caseId, result.data);
                    resultObj['result'] = result.data;
                    resultObj['status'] = assert['result'];
                    resultObj['assert'] = assert;
                    resultObj['errMsg'] = null;
                } else {
                    resultObj['status'] = false;
                    resultObj['result'] = null;
                    resultObj['errMsg'] = result;
                }
                console.log(res)
                // 保存历史记录
                const historyData = {
                    caseId: caseId,
                    status: resultObj['status'] ? 0 : 1,
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
     *
     */
    async runCaseId(caseId, envId, token, isDenpenceParam = false, param = null) {
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
        if (isDenpenceParam) {
            caseObj.param = param;
        }
        if (caseObj instanceof CaseEntity) {
            const endpoint = await this.envService.formatEndpoint(envId, caseObj.endpointObject.endpoint);
            const requestBaseData: RunCaseDto = Object.assign({}, caseObj, {
                endpoint: endpoint,
                type: String(caseObj.type),
            });
            resultObj['caseId'] = caseId;
            resultObj['caseName'] = caseObj.name;
            console.log("requestBaseData", requestBaseData)
            const requestData = this.generateRequestData(requestBaseData);
            if (token != null && token != '') {
                requestData.headers['token'] = token
            }
            console.log(requestData)
            const result = await this.curlService.makeRequest(requestData).toPromise();
            const endTime = new Date();
            resultObj['endTime'] = endTime;
            const rumTime = endTime.getTime() - startTime.getTime();
            resultObj['rumTime'] = rumTime;
            const res = JSON.stringify(result.data);
            if (result.result) {
                const assert = await this.execAssert(caseId, result.data);
                resultObj['result'] = result.data;
                resultObj['status'] = assert['result'];
                resultObj['assert'] = assert;
                resultObj['errMsg'] = null;
            } else {
                resultObj['status'] = false;
                resultObj['result'] = null;
                resultObj['errMsg'] = result;
            }
            console.log(res)
            // 保存历史记录
            const historyData = {
                caseId: caseId,
                status: resultObj['status'] ? 0 : 1,
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
            if (result.result) {
                return res;
            } else {
                return null;
            }
        }
    }

    /**
     * 执行测试用例中的所有接口
     * @param {RunCaseListByIdDto}: 用例Id及环境Id
     * @return {Promise<any>}: 发起请求后的响应结果
     */
    async runCaseListById(runcaseList: IRunCaseList): Promise<any[]> {
        const caseList = await this.caseListRepository
            .createQueryBuilder('caselist')
            .where('caselist.id = :id', {id: runcaseList.caseListId})
            .leftJoinAndSelect('caselist.cases', 'cases')
            .leftJoinAndSelect('cases.endpointObject', 'end')
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

    /**
     * 运行场景
     * @param sceneId
     */
    async runScene(runSceneDto: RunSceneDto) {
        const scene = await this.sceneRepository.findOne(runSceneDto.sceneId).catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        let caseObjList = [];
        const caseJson = JSON.parse(scene.dependenceCaseJson);

        for (let caseJ of caseJson) {
            let caseId = caseJ.caseId;
            const caseObj = await this.caseRepository.findOne(caseId).catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            )
            const index = caseJ.index;
            const isDependenceParam = caseJ.isDependenceParam;
            const caseInstance = {index: index, case: caseObj, isDependenceParam: isDependenceParam};
            caseObjList.push(caseInstance);
        }
        let resultList = [];
        let resultMap = {};
        const paramReg = /\{\{(.+?)\}\}/g;
        const cases = caseObjList.sort(CommonUtil.compare('index'));
        for (let caseObj of cases) {
            const alias = caseObj.case.alias;
            if (caseObj.isDependenceParam) {
                const paramJson = JSON.parse(caseObj.case.param);
                for (let pJson in paramJson) {
                    const value = paramJson[pJson];
                    if (paramReg.test(value)) {
                        const regData = value.toString().replace(paramReg, "$1");
                        const alias = regData.split(".")[0];
                        const newVal = regData.replace(alias, 'data');
                        const paramValue = getAssertObjectValue(JSON.parse(resultMap[alias]), newVal);
                        paramJson[pJson] = paramValue;
                    }
                }
                caseObj.case.param = JSON.stringify(paramJson);
                const result = await this.runCaseId(caseObj.case.id, runSceneDto.envId, runSceneDto.token, true, caseObj.case.param);
                if (result == null) {
                    throw new ApiException(`运行接口ID:${caseObj.case.id}失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                }
                resultMap[alias] = result;
                resultList.push(
                    {id: caseObj.case.id, result: result}
                )
            } else {
                const result = await this.runCaseId(caseObj.case.id, runSceneDto.envId, runSceneDto.token);
                if (result == null) {
                    throw new ApiException(`运行接口ID:${caseObj.case.id}失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                }
                resultMap[alias] = result;
                resultList.push(
                    {id: caseObj.case.id, result: result}
                )
            }

        }
        return resultList;
    }

    /**
     * 解析参数
     * @param param
     */
    analyticParameter(sceneId: number, param: string) {
        if (param == null || param == "") {
            return "";
        }
        let jsonPaaram = {};
        try {
            jsonPaaram = JSON.parse(param);
        } catch (e) {
            throw new ApiException("接口参数不符合json格式", ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        const paramReg = /\{\{(.+?)\}\}/g;
        for (let key in jsonPaaram) {
            const value = jsonPaaram[key];
            if (paramReg.test(value)) {

            }
        }

    }

    // 生成文件流
    private generateFileStream(paramName: string, address: string) {
        const form = new FormData();
        form.append(paramName, request(address))
        return form
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
                    ht += ` -H ${k}:${v}`
                }
            )
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

        const caseObj = await this.caseRepository.createQueryBuilder('case').where('case.id = :id', {id: caseId}).leftJoinAndSelect('case.assertType', 'assertType').leftJoinAndSelect('case.assertJudge', 'assertJudge').getOne().catch(
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
            execResult = getAssertObjectValue(result, caseObj.assertKey)
        } catch (e) {
            assertResult['assertKey'] = caseObj.assertKey;
            assertResult['relation'] = caseObj.assertJudge.name;
            assertResult['expect'] = caseObj.assertText;
            assertResult['actual'] = null;
            assertResult['result'] = (execResult == caseObj.assertText);
            return assertResult;
        }
        execResult = execResult ? execResult : null
        switch (caseObj.assertType.id) {
            case 1:
                switch (caseObj.assertJudge.id) {
                    case 1:
                        assertResult['assertKey'] = caseObj.assertKey;
                        assertResult['relation'] = caseObj.assertJudge.name;
                        assertResult['expect'] = caseObj.assertText;
                        assertResult['actual'] = execResult;
                        assertResult['result'] = (execResult == caseObj.assertText);
                        break;
                    case 2:
                        assertResult['assertKey'] = caseObj.assertKey;
                        assertResult['relation'] = caseObj.assertJudge.name;
                        assertResult['expect'] = caseObj.assertText;
                        assertResult['actual'] = execResult;
                        assertResult['result'] = (execResult < caseObj.assertText);
                        break;
                    case 3:
                        assertResult['assertKey'] = caseObj.assertKey;
                        assertResult['relation'] = caseObj.assertJudge.name;
                        assertResult['expect'] = caseObj.assertText;
                        assertResult['actual'] = execResult;
                        assertResult['result'] = (execResult <= caseObj.assertText);
                        break;
                    case 4:
                        assertResult['assertKey'] = caseObj.assertKey;
                        assertResult['relation'] = caseObj.assertJudge.name;
                        assertResult['expect'] = caseObj.assertText;
                        assertResult['actual'] = execResult;
                        assertResult['result'] = (execResult > caseObj.assertText);
                        break;
                    case 5:
                        assertResult['assertKey'] = caseObj.assertKey;
                        assertResult['relation'] = caseObj.assertJudge.name;
                        assertResult['expect'] = caseObj.assertText;
                        assertResult['actual'] = execResult;
                        assertResult['result'] = (execResult >= caseObj.assertText);
                        break;
                    case 6:
                        assertResult['assertKey'] = caseObj.assertKey;
                        assertResult['relation'] = caseObj.assertJudge.name;
                        assertResult['expect'] = caseObj.assertText;
                        assertResult['actual'] = execResult;
                        assertResult['result'] = (execResult != caseObj.assertText);
                        break;
                    case 7:
                        assertResult['assertKey'] = caseObj.assertKey;
                        assertResult['relation'] = caseObj.assertJudge.name;
                        assertResult['expect'] = caseObj.assertText;
                        assertResult['actual'] = execResult;
                        assertResult['result'] = (execResult.toString().indexOf(caseObj.assertText) != -1);
                        break;
                    case 8:
                        assertResult['assertKey'] = caseObj.assertKey;
                        assertResult['relation'] = caseObj.assertJudge.name;
                        assertResult['expect'] = caseObj.assertText;
                        assertResult['actual'] = execResult;
                        assertResult['result'] = (execResult.toString().indexOf(caseObj.assertText) == -1);
                        break;
                }
                break;
        }
        return assertResult;
    }
}




