import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CaseEntity} from "./case.entity";
import {BatchUpdateCatalogDto, CreateCaseDto, DeleteCaseDto, UpdateCaseDto} from "./dto/case.dto";
import {CatalogEntity} from "../catalog/catalog.entity";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {EndpointEntity} from "../env/endpoint.entity";
import {CommonUtil} from "../../utils/common.util";
import {EnvService} from "../env/env.service";
import { Logger } from "../../utils/log4js";
import {AssertJudgeEntity, AssertTypeEntity} from "./assert.entity";
import {findCatalogById} from "../../datasource/catalog/catalog.sql";
import {findEndpointById} from "../../datasource/env/env.sql";
import {
    findAssertJudgeById,
    findAssertTypeById,
    findCaseByCatalogIdAndCaseTypeAndCaseGrade,
    findCaseByPathAndName,
    saveCase,
    deleteCase,
    findAllAssertType,
    findAllAssertJudge,
    findCaseById,
    updateCase,
    findCaseUnionEndpoint,
    searchCaseByName,
    batchUpdateCaseOfCatalogId, finCaseNamesByIds
} from "../../datasource/case/case.sql";
import {findTokenById} from "../../datasource/token/token.sql";
import {TokenEntity} from "../token/token.entity";

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
        @InjectRepository(TokenEntity)
        private readonly tokenRepository: Repository<TokenEntity>,
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

        Logger.info(`添加目录:${createCaseDto.name}`);
        const caseObj = new CaseEntity();

        if (createCaseDto.isNeedSign != null) caseObj.isNeedSign = createCaseDto.isNeedSign;
        if (createCaseDto.caseGrade != null) caseObj.caseGrade = createCaseDto.caseGrade;
        if (createCaseDto.tokenId != null) caseObj.token = await findTokenById(this.tokenRepository, createCaseDto.tokenId);
        if (createCaseDto.isFailNotice != null) caseObj.isFailNotice = createCaseDto.isFailNotice;
        const catalogId = createCaseDto.catalogId;
        const [catalog] = await Promise.all([findCatalogById(this.catalogRepository, createCaseDto.catalogId)]);
        if (!catalog) throw new ApiException(`添加的catalogid:${catalogId}不存在`, ApiErrorCode.CATALOG_ID_INVALID, HttpStatus.BAD_REQUEST);
        if (createCaseDto.type != null) caseObj.type = createCaseDto.type;
        if (createCaseDto.paramType != null) caseObj.paramType = createCaseDto.paramType;
        if (createCaseDto.endpointId != null) caseObj.endpointObject = await findEndpointById(this.endpointRepository, createCaseDto.endpointId);
        if (!caseObj.endpointObject) throw new ApiException(`endpointId:${createCaseDto.endpointId}不存在`, ApiErrorCode.ENDPOINT_ID_INVALID, HttpStatus.BAD_REQUEST);
        let pa = CommonUtil.handlePath(createCaseDto.path);
        const caObj = await findCaseByPathAndName(this.caseRepository, pa.trim(), createCaseDto.name);
        if (caObj) throw new ApiException(`path:${createCaseDto.path}与名称：${createCaseDto.name}已存在`, ApiErrorCode.CASE_NAME_PATH_INVALID, HttpStatus.BAD_REQUEST);
        const assertType = await findAssertTypeById(this.assertTypeRepository, createCaseDto.assertType);
        if (!assertType) throw new ApiException(`assertTypeId:${createCaseDto.assertType}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        const assertJudge = await findAssertJudgeById(this.assertJudgeRepository, createCaseDto.assertJudge);
        if (!assertJudge) throw new ApiException(`assertJudgeId:${createCaseDto.assertJudge}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);

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
        const result = await saveCase(this.caseRepository, caseObj);
        const cObj = new CaseEntity();
        cObj.alias = "alias" + result.id;
        await updateCase(this.caseRepository, cObj, result.id);
        return {id: result.id};

    }

    /**
     * 查询用例
     * @param catalogId 目录ID
     * @param envId 环境ID
     * @param caseGradeList
     * @param options 分页信息
     */
    async findCase(catalogId: number, envId: number, caseGradeList: number[], options: IPaginationOptions): Promise<Pagination<CaseEntity>> {

        if (envId == 0 || envId == null) throw new ApiException(`envId不能为空或者0`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        const queryBuilder = await findCaseByCatalogIdAndCaseTypeAndCaseGrade(this.caseRepository, catalogId, caseGradeList);
        const result = await paginate<CaseEntity>(queryBuilder, options);
        for (let item of result.items) item.endpoint = await this.envService.formatEndpoint(envId, item.endpointObject.endpoint);
        return result;
    }

    /**
     * 通过id删除用例
     * @param deleteCaseDto
     */
    async deleteById(deleteCaseDto: DeleteCaseDto) {
        const caseNames = await finCaseNamesByIds(this.caseRepository, deleteCaseDto.ids);
        Logger.info(`删除的用例：${caseNames.map(cas => {return cas.name})}`);
        return await deleteCase(this.caseRepository, deleteCaseDto.ids);
    }

    /**
     * 获取所有的断言类型
     */
    async getAllAssertType() {
        return await findAllAssertType(this.assertTypeRepository);
    }

    /**
     * 获取所有的断言判断
     */
    async getAllAssertJudge() {
        return await findAllAssertJudge(this.assertJudgeRepository);
    }

    /**
     * 更新接口用例
     * @param updateCaseDto
     */
    async updateCase(updateCaseDto: UpdateCaseDto) {

        console.log(JSON.stringify(updateCaseDto))
        const caseObj = new CaseEntity();
        if (updateCaseDto.isNeedSign != null) caseObj.isNeedSign = updateCaseDto.isNeedSign;
        if (updateCaseDto.tokenId) caseObj.token = await findTokenById(this.tokenRepository, updateCaseDto.tokenId);
        if (updateCaseDto.isFailNotice != null) caseObj.isFailNotice = updateCaseDto.isFailNotice;
        if (updateCaseDto.caseGrade != null) caseObj.caseGrade = updateCaseDto.caseGrade;
        if (!await findCaseById(this.caseRepository, updateCaseDto.id)) {
            throw new ApiException(`更改case的id:${updateCaseDto.id}不存在`, ApiErrorCode.CASE_ID_INVALID, HttpStatus.OK);
        }
        if (updateCaseDto.endpointId != null) caseObj.endpointObject = await findEndpointById(this.endpointRepository, updateCaseDto.endpointId);
        if (updateCaseDto.catalogId != null) caseObj.catalog = await findCatalogById(this.catalogRepository, updateCaseDto.catalogId);
        if (updateCaseDto.header) caseObj.header = updateCaseDto.header;
        if (updateCaseDto.paramType != null) caseObj.paramType = updateCaseDto.paramType;
        if (updateCaseDto.param) caseObj.param = updateCaseDto.param;
        if (updateCaseDto.type != null) caseObj.type = updateCaseDto.type;
        if (updateCaseDto.path != null) caseObj.path = CommonUtil.handlePath(updateCaseDto.path);
        if (updateCaseDto.endpoint) caseObj.endpoint = updateCaseDto.endpoint;

        if (updateCaseDto.name) caseObj.name = updateCaseDto.name;
        if (updateCaseDto.assertText) caseObj.assertText = updateCaseDto.assertText;
        if (updateCaseDto.assertType != null) caseObj.assertType = await findAssertTypeById(this.assertTypeRepository, updateCaseDto.assertType);
        if (updateCaseDto.assertJudge != null) caseObj.assertJudge = await findAssertJudgeById(this.assertJudgeRepository, updateCaseDto.assertJudge);
        if (updateCaseDto.assertKey != null) caseObj.assertKey = updateCaseDto.assertKey;
        return await updateCase(this.caseRepository, caseObj, updateCaseDto.id);
    }

    async searchCaseByNameService(name: string) {
        return await searchCaseByName(this.caseRepository, name);
    }

    async unionFindAllEndpoint() {
        return await findCaseUnionEndpoint(this.caseRepository);
    }

    /**
     * 批量更新目录ID
     * @param batchUpdateCatalogDto
     */
    async batchUpdateCatalog(batchUpdateCatalogDto: BatchUpdateCatalogDto){
        const catalog = await findCatalogById(this.catalogRepository, batchUpdateCatalogDto.catalogId);
        CommonUtil.printLog1(JSON.stringify(catalog))
        return await batchUpdateCaseOfCatalogId(this.caseRepository, batchUpdateCatalogDto.caseIds, catalog);
    }
}
