import {InjectRepository} from '@nestjs/typeorm';
import {InsertResult, Repository} from 'typeorm';
import {CaseEntity} from './case.entity';
import {CaseGrade, CaseType, CreateCaseDto, DeleteCaseDto, UpdateCaseDto} from './dto/case.dto';
import {CatalogEntity} from '../catalog/catalog.entity';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import {ParamType, RequestType} from './dto/http.enum';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
import {EndpointEntity} from '../env/endpoint.entity';
import {CommonUtil} from '../../util/common.util';
import {EnvService} from "../env/env.service";
import {AssertJudgeEntity, AssertTypeEntity} from "./assert.entity";

export class CaseService {
    constructor(
        @InjectRepository(CaseEntity)
        private readonly caseRepository: Repository<CaseEntity>,
        @InjectRepository(CatalogEntity)
        private readonly catalogRepository: Repository<CatalogEntity>,
        @InjectRepository(EndpointEntity)
        private readonly endpointRepository: Repository<EndpointEntity>,
        @InjectRepository(AssertTypeEntity)
        private readonly assertTypeRepository: Repository<AssertTypeEntity>,
        @InjectRepository(AssertJudgeEntity)
        private readonly assertJudgeRepository: Repository<AssertJudgeEntity>,
        private readonly envService: EnvService
    ) {
    }

    /**
     * 分页信息
     * @param options
     */
    async paginate(options: IPaginationOptions): Promise<Pagination<CaseEntity>> {
        return await paginate<CaseEntity>(this.caseRepository, options);
    }

    /**
     * 添加用例
     * @param createCaseDto
     */
    async addCase(createCaseDto: CreateCaseDto) {
        const caseObj = new CaseEntity();
        if (createCaseDto.isNeedToken != null) {
            caseObj.isNeedToken = createCaseDto.isNeedToken;
        }
        if (createCaseDto.caseGrade){
            caseObj.caseGrade = this.getCaseGrade(createCaseDto.caseGrade)
        }
        if (createCaseDto.caseType){
            caseObj.caseType = this.getCaseType(createCaseDto.caseType)
        }
        const catalogId = createCaseDto.catalogId;
        const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id', {id: catalogId}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (!catalog) {
            throw new ApiException(`添加的catalogid:${catalogId}不存在`, ApiErrorCode.CATALOG_ID_INVALID, HttpStatus.BAD_REQUEST);
        }
        if (typeof createCaseDto.type != "undefined") {
            const type = this.getRequestType(createCaseDto.type);
            caseObj.type = type;
        }
        if (typeof createCaseDto.paramType != "undefined") {
            caseObj.paramType = this.getParamType(createCaseDto.paramType);
        }
        if (createCaseDto.endpointId != null) {
            const endpoint = await this.endpointRepository.createQueryBuilder().select().where('id = :id', {id: createCaseDto.endpointId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!endpoint) {
                throw new ApiException(`endpointId:${createCaseDto.endpointId}不存在`, ApiErrorCode.ENDPOINT_ID_INVALID, HttpStatus.BAD_REQUEST);
            }
            caseObj.endpointObject = endpoint;
        }
        let pa;
        if (createCaseDto.path.charAt(0) != '/') {
            pa = "/" + createCaseDto.path;
        } else {
            pa = createCaseDto.path;
        }
        const caObj = await this.caseRepository.createQueryBuilder('case').select().where('case.path = :path', {path: pa.trim()}).andWhere('case.name = :caseName', {caseName: createCaseDto.name}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (caObj) {
            throw new ApiException(`path:${createCaseDto.path}与名称：${createCaseDto.name}已存在`, ApiErrorCode.CASE_NAME_PATH_INVALID, HttpStatus.BAD_REQUEST);
        }
        const assertType = await this.assertTypeRepository.findOne(createCaseDto.assertType).catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );

        if (!assertType) {
            throw new ApiException(`assertTypeId:${createCaseDto.assertType}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        const assertJudge = await this.assertJudgeRepository.findOne(createCaseDto.assertJudge).catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (!assertJudge) {
            throw new ApiException(`assertJudgeId:${createCaseDto.assertJudge}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        caseObj.assertKey = createCaseDto.assertKey;
        caseObj.assertType = assertType;
        caseObj.assertJudge = assertJudge;
        caseObj.catalog = catalog;
        caseObj.endpoint = createCaseDto.endpoint;
        caseObj.assertText = createCaseDto.assertText;
        caseObj.name = createCaseDto.name;
        caseObj.path = pa;
        caseObj.header = createCaseDto.header;
        caseObj.param = createCaseDto.param;

        if (createCaseDto.alias){
            caseObj.alias = createCaseDto.alias;
        }
        await this.caseRepository.createQueryBuilder().insert()
        const result: InsertResult = await this.caseRepository.createQueryBuilder()
            .insert()
            .into(CaseEntity)
            .values(caseObj)
            .execute().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
        const addId = result.identifiers[0].id;
        return {id: addId};
    }

    /**
     * 查询用例
     * @param catalogId 目录ID
     * @param envId 环境ID
     * @param options 分页信息
     */
    async findCase(catalogId: number, envId: number, caseType: number, caseGradeList: number[], options: IPaginationOptions): Promise<Pagination<CaseEntity>> {
        if (envId == 0 || envId == null) {
            throw new ApiException(`envId不能为空或者0`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        const caseTypeVal = this.getCaseType(caseType);
        if (typeof catalogId == 'undefined') {
            const queryBuilder = this.caseRepository.createQueryBuilder('case').
            leftJoinAndSelect('case.endpointObject', 'endpoint').
            leftJoinAndSelect('case.assertType', 'assertType').
            leftJoinAndSelect('case.assertJudge', 'assertJudge').
            where('case.caseType = :caseType',{caseType : caseTypeVal}).
            andWhere('case.caseGrade  IN (:...caseGradeList)', {caseGradeList: caseGradeList}).
            orderBy('case.updateDate', 'DESC');
            const result = await paginate<CaseEntity>(queryBuilder, options);
            for (let item of result.items) {
                const endpoint = await this.envService.formatEndpoint(envId, item.endpointObject.endpoint);
                item.endpoint = endpoint;
            }
            return result;
        } else {
            const catalog = await this.catalogRepository.createQueryBuilder().select().
            where('id = :id', {id: catalogId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!catalog) {
                throw new ApiException(`查询关联的catalogId:${catalogId}不存在`, ApiErrorCode.CATALOG_ID_INVALID, HttpStatus.OK);
            }
            const queryBuilder = this.caseRepository.createQueryBuilder('case').
            leftJoinAndSelect('case.endpointObject', 'endpoint')
                .leftJoinAndSelect('case.assertType', 'assertType').
                leftJoinAndSelect('case.assertJudge', 'assertJudge').
                where('case.catalog = :catalog', {catalog: catalogId}).
                andWhere('case.caseType = :caseType',{caseType : caseTypeVal}).
                andWhere('case.caseGrade  IN (:...caseGradeList)', {caseGradeList: caseGradeList}).
                orderBy('case.updateDate', 'DESC');
            const result = await paginate<CaseEntity>(queryBuilder, options);
            for (let item of result.items) {
                const endpoint = await this.envService.formatEndpoint(envId, item.endpointObject.endpoint);
                item.endpoint = endpoint;
            }
            return result;
        }
    }

    /**
     * 通过id删除用例
     * @param deleteCaseDto
     */
    async deleteById(deleteCaseDto: DeleteCaseDto) {
        deleteCaseDto.ids.forEach(
            id => {
                if (!CommonUtil.isNumber(id)) {
                    throw new ApiException(`数组值${id}必须为数字`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                }
            }
        );
        let result = [];
        for (const delId of deleteCaseDto.ids) {
            const caseObj = await this.caseRepository.createQueryBuilder().select().where('id = :id', {id: delId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!caseObj) {
                throw new ApiException(`删除的ID: ${delId}不存在`, ApiErrorCode.CASE_ID_INVALID, HttpStatus.OK);
            }
            const res = await this.caseRepository.createQueryBuilder().delete().where('id = :id', {id: delId}).execute().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (res.affected == 1) {
                result.push({
                    id: delId,
                    status: true
                })
            } else {
                result.push({
                    id: delId,
                    status: false
                })
            }
        }
        return result;
    }

    /**
     * 获取所有的断言类型
     */
    async getAllAssertType() {
        const result = await this.assertTypeRepository.createQueryBuilder().getMany().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        return result;
    }

    /**
     * 获取所有的断言判断
     */
    async getAllAssertJudge() {
        const result = await this.assertJudgeRepository.createQueryBuilder().getMany().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        return result;
    }

    /**
     * 更新接口用例
     * @param updateCaseDto
     */
    async updateCase(updateCaseDto: UpdateCaseDto): Promise<Object> {

        const cases = new CaseEntity();
        if (updateCaseDto.isNeedToken != null) {
            cases.isNeedToken = updateCaseDto.isNeedToken;
        }
        if (updateCaseDto.alias){
            cases.alias = updateCaseDto.alias;
        }
        if (updateCaseDto.caseGrade){
            cases.caseGrade = this.getCaseGrade(updateCaseDto.caseGrade)
        }
        if (updateCaseDto.caseType){
            cases.caseType = this.getCaseType(updateCaseDto.caseType)
        }
        const id = updateCaseDto.id;
        const caseObj = await this.caseRepository.createQueryBuilder().select().where('id = :id', {id: id}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (updateCaseDto.endpointId != null) {
            const endpoint = await this.endpointRepository.createQueryBuilder().select().where('id = :id', {id: updateCaseDto.endpointId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!endpoint) {
                throw new ApiException(`endpointId:${updateCaseDto.endpointId}不存在`, ApiErrorCode.ENDPOINT_ID_INVALID, HttpStatus.BAD_REQUEST);
            }
            cases.endpointObject = endpoint;
        }
        if (!caseObj) {
            throw new ApiException(`查询case的id:${id}不存在`, ApiErrorCode.CASE_ID_INVALID, HttpStatus.OK);
        }
        if (updateCaseDto.catalogId != null) {
            const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id', {id: updateCaseDto.catalogId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!catalog) {
                throw new ApiException(`查询catalog的id:${updateCaseDto.catalogId}不存在`, ApiErrorCode.CATALOG_ID_INVALID, HttpStatus.OK);
            }
            cases.catalog = catalog;
        }
        if (updateCaseDto.header) {
            cases.header = updateCaseDto.header;
        }
        if (updateCaseDto.param) {
            cases.param = updateCaseDto.param;
        }
        cases.type = this.getRequestType(Number(updateCaseDto.type));
        cases.id = id;
        if (updateCaseDto.path) {
            let pa;
            if (updateCaseDto.path.charAt(0) != '/') {
                pa = "/" + updateCaseDto.path;
            } else {
                pa = updateCaseDto.path;
            }
            cases.path = pa;
        }
        if (updateCaseDto.endpoint) {
            cases.endpoint = updateCaseDto.endpoint;
        }
        if (updateCaseDto.name) {
            cases.name = updateCaseDto.name;
        }
        if (updateCaseDto.assertText) {
            cases.assertText = updateCaseDto.assertText;
        }
        if (updateCaseDto.assertType){
            const assertType = await this.assertTypeRepository.findOne(updateCaseDto.assertType).catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );

            if (!assertType) {
                throw new ApiException(`assertTypeId:${updateCaseDto.assertType}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            }
            cases.assertType = assertType;
        }

        if (updateCaseDto.assertJudge){
            const assertJudge = await this.assertJudgeRepository.findOne(updateCaseDto.assertJudge).catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!assertJudge) {
                throw new ApiException(`assertJudgeId:${updateCaseDto.assertJudge}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            }
            cases.assertJudge = assertJudge;
        }

        if (updateCaseDto.assertKey){
            cases.assertKey = updateCaseDto.assertKey;
        }
        await this.caseRepository.createQueryBuilder().update(CaseEntity).set(cases).where('id = :id', {id: id}).execute().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        return {
            status: true
        };
    }

    async unionFindAllEndpoint() {
        const result = await this.caseRepository.createQueryBuilder('case').select('case.endpoint').groupBy('case.endpoint').addGroupBy('case.id').getMany().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        return result;
    }

    /**
     * 转换请求类型
     * @param type
     */
    private getRequestType(type: number): RequestType {
        switch (type) {
            case 0:
                return RequestType.GET;
                break;
            case 1:
                return RequestType.POST;
                break;
            case 2:
                return RequestType.DELETE;
            case 3:
                return RequestType.PUT;
                break;
            default:
                throw new ApiException(`type值在[0,1,2,3]中`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 转换参数类型
     * @param type
     */
    private getParamType(type: number): ParamType {
        switch (type) {
            case 0:
                return ParamType.TEXT;
                break;
            case 1:
                return ParamType.FILE;
                break;
            default:
                throw new ApiException(`param type值在[0,1]中`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 转换用例等级
     * @param grade
     */
    private getCaseGrade(grade: number): CaseGrade {
        switch (grade) {
            case 0:
                return CaseGrade.HIGH;
                break;
            case 1:
                return CaseGrade.IN;
                break;
            case 2:
                return CaseGrade.LOW;
                break;
            default:
                throw new ApiException(`grade 值在[0,1,2]中`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 转换用例类别
     * @param grade
     */
    private getCaseType(type: number): CaseType {
        switch (type) {
            case 0:
                return CaseType.SINGLE;
                break;
            case 1:
                return CaseType.SCENE;
                break;
            case 2:
                return CaseType.BLEND;
                break;
            default:
                throw new ApiException(`caseType 值在[0,1,2]中`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
    }



}
