import {InjectRepository} from '@nestjs/typeorm';
import {InsertResult, Repository} from 'typeorm';
import {CaseEntity} from './case.entity';
import {CreateCaseDto, QueryCaseDto, UpdateCaseDto} from './dto/case.dto';
import {CatalogEntity} from '../catalog/catalog.entity';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import {RequestType} from './dto/http.enum';
import {paginate,IPaginationOptions, Pagination} from 'nestjs-typeorm-paginate';

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
        const caseObj = new CaseEntity();
        const catalogId = createCaseDto.catalogId;
        const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id',{id: catalogId}).getOne().catch(
            err => {
                console.log(err)
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        if (!catalog){
            throw new ApiException(`添加的catalogid:${catalogId}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        const result: InsertResult = await this.caseRepository.createQueryBuilder()
            .insert()
            .into(CaseEntity)
            .values({type: this.getRequestType(createCaseDto.type), name: createCaseDto.name, url: createCaseDto.url, header: createCaseDto.header, param: createCaseDto.param, catalog: catalog})
            .execute().catch(
                err => {
                    console.log(err)
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            )
        const addId = result.identifiers[0].id;
        return {id: addId};
    }

    async findCase(catalogId: number, options: IPaginationOptions): Promise<Pagination<CaseEntity>> {
        if (typeof catalogId == "undefined"){
            const queryBuilder = this.caseRepository.createQueryBuilder('case').orderBy('case.updateDate','DESC');
            return await paginate<CaseEntity>(queryBuilder, options);
        }else {
           const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id',{id: catalogId}).getOne().catch(
                err => {
                    console.log(err)
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
           if (!catalog){
               throw new ApiException(`查询关联的catalogId:${catalogId}不存在`, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
           }
            const queryBuilder = this.caseRepository.createQueryBuilder('case').where('case.catalog = :catalog',{catalog: catalogId}).orderBy('case.updateDate','DESC');
            return await paginate<CaseEntity>(queryBuilder, options);

        }



    }

    async deleteById(ids: string): Promise<void> {

    }

    private getRequestType(type: number): RequestType{
        switch (type) {
            case 1:
                return RequestType.GET;
                break;
            case 2:
                return RequestType.POST;
                break;
            case 3:
                return RequestType.DELETE;
                break;
            default:
                return RequestType.GET;
        }
    }

    async updateCase(updateCaseDto: UpdateCaseDto): Promise<Object> {

        return null;
    }

}
