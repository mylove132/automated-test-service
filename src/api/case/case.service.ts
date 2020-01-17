import {InjectRepository} from '@nestjs/typeorm';
import {InsertResult, Repository} from 'typeorm';
import {CaseEntity} from './case.entity';
import {CreateCaseDto, DeleteCaseDto, UpdateCaseDto} from './dto/case.dto';
import {CatalogEntity} from '../catalog/catalog.entity';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import {ParamType, RequestType} from './dto/http.enum';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
import {CaselistEntity} from '../caselist/caselist.entity';
import {EndpointEntity} from '../env/endpoint.entity';
import {CommonUtil} from '../../util/common.util';
import {EnvService} from "../env/env.service";

export class CaseService {
    constructor(
        @InjectRepository(CaseEntity)
        private readonly caseRepository: Repository<CaseEntity>,
        @InjectRepository(CatalogEntity)
        private readonly catalogRepository: Repository<CatalogEntity>,
        @InjectRepository(CaselistEntity)
        private readonly caseListRepository: Repository<CaselistEntity>,
        @InjectRepository(EndpointEntity)
        private readonly endpointRepository: Repository<EndpointEntity>,
        private readonly envService: EnvService
    ) {
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<CaseEntity>> {
        return await paginate<CaseEntity>(this.caseRepository, options);
    }

    async addCase(createCaseDto: CreateCaseDto) {

        const caseObj = new CaseEntity();
        if (createCaseDto.isNeedToken != null){
            caseObj.isNeedToken = createCaseDto.isNeedToken;
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
        if (typeof createCaseDto.type != "undefined"){
            const type = this.getRequestType(createCaseDto.type);
            caseObj.type = type;
        }
        if (typeof createCaseDto.paramType != "undefined"){
            caseObj.paramType = this.getParamType(createCaseDto.paramType);
        }
        if (createCaseDto.endpointId != null){
            const endpoint = await this.endpointRepository.createQueryBuilder().select().where('id = :id',{id:createCaseDto.endpointId}).getOne().catch(
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
        if (createCaseDto.path.charAt(0) != '/'){
            pa = "/"+createCaseDto.path;
        }else {
            pa = createCaseDto.path;
        }
        caseObj.catalog = catalog;
        caseObj.endpoint = createCaseDto.endpoint;
        caseObj.assertText = createCaseDto.assertText;
        caseObj.name = createCaseDto.name;
        caseObj.path = pa;
        caseObj.header = createCaseDto.header;
        caseObj.param = createCaseDto.param;

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

    async findCase(catalogId: number, envId: number, options: IPaginationOptions): Promise<Pagination<CaseEntity>> {
        if (envId == 0 || envId == null){
            throw new ApiException(`envId不能为空或者0`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        if (typeof catalogId == 'undefined') {
            const queryBuilder = this.caseRepository.createQueryBuilder('case').leftJoinAndSelect('case.endpointObject','endpoint').orderBy('case.updateDate', 'DESC');
            const result = await paginate<CaseEntity>(queryBuilder, options);
            for (let item of result.items){
                const endpoint = await this.envService.formatEndpoint(envId, item.endpointObject.endpoint);
                item.endpoint = endpoint;
            }
            return result;
        } else {
            const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id', {id: catalogId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!catalog) {
                throw new ApiException(`查询关联的catalogId:${catalogId}不存在`, ApiErrorCode.CATALOG_ID_INVALID, HttpStatus.OK);
            }
            const queryBuilder = this.caseRepository.createQueryBuilder('case').where('case.catalog = :catalog', {catalog: catalogId}).leftJoinAndSelect('case.endpointObject','endpoint').orderBy('case.updateDate', 'DESC');
            const result = await paginate<CaseEntity>(queryBuilder, options);
            for (let item of result.items){
                const endpoint = await this.envService.formatEndpoint(envId, item.endpointObject.endpoint);
                item.endpoint = endpoint;
            }
            return result;
        }
    }

    async deleteById(deleteCaseDto: DeleteCaseDto) {
        deleteCaseDto.ids.forEach(
            id => {
                if (!CommonUtil.isNumber(id)){
                    throw new ApiException(`数组值${id}必须为数字`, ApiErrorCode.PARAM_VALID_FAIL,HttpStatus.BAD_REQUEST);
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
            if (res.affected == 1){
                result.push({
                    id: delId,
                    status: true
                })
            }else {
                result.push({
                    id: delId,
                    status: false
                })
            }
        }
        return result;
    }


    async updateCase(updateCaseDto: UpdateCaseDto): Promise<Object> {

        const cases = new CaseEntity();
        if (updateCaseDto.isNeedToken != null){
            cases.isNeedToken = updateCaseDto.isNeedToken;
        }
        const id = updateCaseDto.id;
        const caseObj = await this.caseRepository.createQueryBuilder().select().where('id = :id', {id: id}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (updateCaseDto.endpointId != null){
            const endpoint = await this.endpointRepository.createQueryBuilder().select().where('id = :id',{id:updateCaseDto.endpointId}).getOne().catch(
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
            if (updateCaseDto.path.charAt(0) != '/'){
                pa = "/"+updateCaseDto.path;
            }else {
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

    async findCaseByEndpointAndPath(){}

    async unionFindAllEndpoint(){
        const result = await this.caseRepository.createQueryBuilder('case').select('case.endpoint').groupBy('case.endpoint').addGroupBy('case.id').getMany().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        return result;
    }


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
}
