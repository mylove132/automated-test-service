import {InjectRepository} from '@nestjs/typeorm';
import {InsertResult, Repository} from 'typeorm';
import {CaseEntity} from './case.entity';
import {AddCaseListDto, CreateCaseDto, UpdateCaseDto} from './dto/case.dto';
import {CatalogEntity} from '../catalog/catalog.entity';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import {ParamType, RequestType} from './dto/http.enum';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
import {CaselistEntity} from '../caselist/caselist.entity';
import {of} from 'rxjs';

export class CaseService {
    constructor(
        @InjectRepository(CaseEntity)
        private readonly caseRepository: Repository<CaseEntity>,
        @InjectRepository(CatalogEntity)
        private readonly catalogRepository: Repository<CatalogEntity>,
        @InjectRepository(CaselistEntity)
        private readonly caseListRepository: Repository<CaselistEntity>,
    ) {
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<CaseEntity>> {
        return await paginate<CaseEntity>(this.caseRepository, options);
    }

    async addCase(createCaseDto: CreateCaseDto) {

        const caseObj = new CaseEntity();
        const catalogId = createCaseDto.catalogId;
        const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id', {id: catalogId}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (!catalog) {
            throw new ApiException(`添加的catalogid:${catalogId}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        if (typeof createCaseDto.type != "undefined"){
            const type = this.getRequestType(Number(createCaseDto.type));
            caseObj.type = type;
        }
        console.log(createCaseDto.paramType)
        if (typeof createCaseDto.paramType != "undefined"){
            caseObj.paramType = this.getParamType(Number(createCaseDto.paramType));
        }
        caseObj.catalog = catalog;
        caseObj.endpoint = createCaseDto.endpoint;
        caseObj.assertText = createCaseDto.assertText;
        caseObj.name = createCaseDto.name;
        caseObj.path = createCaseDto.path;
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

    async findCase(catalogId: number, options: IPaginationOptions): Promise<Pagination<CaseEntity>> {
        if (typeof catalogId == 'undefined') {
            const queryBuilder = this.caseRepository.createQueryBuilder('case').orderBy('case.updateDate', 'DESC');
            return await paginate<CaseEntity>(queryBuilder, options);
        } else {
            const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id', {id: catalogId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!catalog) {
                throw new ApiException(`查询关联的catalogId:${catalogId}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
            }
            const queryBuilder = this.caseRepository.createQueryBuilder('case').where('case.catalog = :catalog', {catalog: catalogId}).orderBy('case.updateDate', 'DESC');
            return await paginate<CaseEntity>(queryBuilder, options);
        }
    }

    async deleteById(ids: string) {
        let delList = ids.split(',');
        let result = [];
        for (const delId of delList) {
            console.log(delId);
            const caseObj = await this.caseRepository.createQueryBuilder().select().where('id = :id', {id: Number(delId)}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            console.log(caseObj);
            if (!caseObj) {
                throw new ApiException(`删除的ID: ${delId}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
            }
            await this.caseRepository.createQueryBuilder().delete().where('id = :id', {id: Number(delId)}).execute().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            result.push(
                {
                    id: delId,
                    result: true
                }
            );
        }
        return result;
    }


    async updateCase(updateCaseDto: UpdateCaseDto): Promise<Object> {

        const cases = new CaseEntity();
        const id = updateCaseDto.id;
        const caseObj = await this.caseRepository.createQueryBuilder().select().where('id = :id', {id: id}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (!caseObj) {
            throw new ApiException(`查询case的id:${id}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
        }
        if (updateCaseDto.catalogId != null) {
            const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id', {id: updateCaseDto.catalogId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!catalog) {
                throw new ApiException(`查询catalog的id:${updateCaseDto.catalogId}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
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
            cases.path = updateCaseDto.path;
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
