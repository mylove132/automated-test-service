import {InjectRepository} from '@nestjs/typeorm';
import {InsertResult, Repository} from 'typeorm';
import {CaseEntity} from './case.entity';
import {CreateCaseDto, UpdateCaseDto} from './dto/case.dto';
import {CatalogEntity} from '../catalog/catalog.entity';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import {RequestType} from './dto/http.enum';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';

export class CaseService {
    constructor(
        @InjectRepository(CaseEntity)
        private readonly caseRepository: Repository<CaseEntity>,
        @InjectRepository(CatalogEntity)
        private readonly catalogRepository: Repository<CatalogEntity>,
    ) {
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<CaseEntity>> {
        return await paginate<CaseEntity>(this.caseRepository, options);
    }

    async addCase(createCaseDto: CreateCaseDto) {
        console.log(createCaseDto);
        const type = this.getRequestType(Number(createCaseDto.type));
        console.log(type);
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
        const result: InsertResult = await this.caseRepository.createQueryBuilder()
            .insert()
            .into(CaseEntity)
            .values({
                type: type,
                name: createCaseDto.name,
                url: createCaseDto.url,
                header: createCaseDto.header,
                param: createCaseDto.param,
                catalog: catalog
            })
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
        if (updateCaseDto.url) {
            cases.url = updateCaseDto.url;
        }
        if (updateCaseDto.name) {
            cases.name = updateCaseDto.name;
        }

        const result = await this.caseRepository.createQueryBuilder().update(CaseEntity).set(cases).where('id = :id', {id: id}).execute().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        return {
            status: true
        };
    }

}
