import {InjectRepository} from '@nestjs/typeorm';
import {CaseEntity} from '../case/case.entity';
import {Repository} from 'typeorm';
import {CaselistEntity} from './caselist.entity';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import {CommonUtil} from '../../util/common.util';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
import {AddCaseListDto, CaseListIdsDto, UpdateCaseListDto} from './dto/caselist.dto';
import {EnvEntity} from '../env/env.entity';

var parser = require('cron-parser');

export class CaselistService {

    constructor(
        @InjectRepository(CaseEntity)
        private readonly caseRepository: Repository<CaseEntity>,
        @InjectRepository(CaselistEntity)
        private readonly caseListRepository: Repository<CaselistEntity>,
        @InjectRepository(EnvEntity)
        private readonly envRepository: Repository<EnvEntity>,
    ) {
    }


    async addCaseList(addCaseListDto: AddCaseListDto){
        const rt = await this.checkCron(addCaseListDto.cron);
        if (!rt){
            throw new ApiException(`cron表达式：${addCaseListDto.cron}  格式不正确`,ApiErrorCode.SCHEDULER_CRON_INVAILD, HttpStatus.BAD_REQUEST);
        }
        const caseListOBj = new CaselistEntity();
        caseListOBj.name = addCaseListDto.caseListName;
        if (addCaseListDto.cron){
            caseListOBj.cron = addCaseListDto.cron;
            caseListOBj.isTask = true;
        }
        if (addCaseListDto.desc){
            caseListOBj.desc = addCaseListDto.desc;
        }
        const envObj = await this.envRepository.createQueryBuilder().select().where('id = :id',{id: addCaseListDto.envId}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        if (!envObj){
            throw new ApiException(`添加用例case的环境ID:${addCaseListDto.envId}不存在`, ApiErrorCode.CASE_ID_INVALID, HttpStatus.OK);
        }
        caseListOBj.env = envObj;
        let caseList = [];
        for (const addId of addCaseListDto.caseIds){
            const caseObj = await this.caseRepository.createQueryBuilder().select().where('id = :id',{id:addId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!caseObj){
                throw new ApiException(`添加用例case的ID:${addId}不存在`, ApiErrorCode.CASE_ID_INVALID, HttpStatus.OK);
            }else {
                caseList.push(caseObj);
            }
        }
        caseListOBj.cases = caseList;

        const result = await this.caseListRepository.save(caseListOBj).catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        return result;

    }

    async checkCron(cron: string){
        try {
            await parser.parseExpression(cron);
            return true;
        }catch (e) {
            return false;
        }
    }

    async updateCaseList(updateCaseListDto: UpdateCaseListDto) {
        const rt = await this.checkCron(updateCaseListDto.cron);
        if (!rt){
            throw new ApiException(`cron表达式：${updateCaseListDto.cron}  格式不正确`,ApiErrorCode.SCHEDULER_CRON_INVAILD, HttpStatus.BAD_REQUEST);
        }
        const caseListObj = await this.caseListRepository.createQueryBuilder().select().where('id = :id',{id: updateCaseListDto.id}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (!caseListObj){
            throw new ApiException(`修改用例caselist的ID:${updateCaseListDto.id}不存在`, ApiErrorCode.CASELIST_ID_INVALID, HttpStatus.OK);
        }

        let caseList = new CaselistEntity();
        let caseObjList = [];
        if (updateCaseListDto.caseIds){
            for (const caseId of updateCaseListDto.caseIds){
                const caseObj = await this.caseRepository.createQueryBuilder().select().where('id = :id',{id:caseId}).getOne().catch(
                    err => {
                        console.log(err);
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                )
                if(!caseObj){
                    throw new ApiException(`查询接口case的ID:${caseId}不存在`, ApiErrorCode.CASE_ID_INVALID, HttpStatus.OK);
                }
                caseObjList.push(caseObj);
            }
            caseList.cases = caseObjList;
        }
        if (updateCaseListDto.caseListName){
            caseList.name = updateCaseListDto.caseListName;
        }
        if (updateCaseListDto.cron){
            caseList.cron = updateCaseListDto.cron
        }
        if (updateCaseListDto.desc){
            caseList.desc = updateCaseListDto.desc;
        }
        if (updateCaseListDto.envId){
            const envObj = await this.envRepository.createQueryBuilder().select().where('id = :id',{id: updateCaseListDto.envId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            )
            if (!envObj) {
                throw new ApiException(`查询接口env的ID:${updateCaseListDto.envId}不存在`, ApiErrorCode.ENV_ID_INVALID, HttpStatus.OK);
            }
        caseList.env = envObj;
        }
        const result = await this.caseListRepository.createQueryBuilder().update(CaselistEntity).set(caseList).where('id = :id',{id: updateCaseListDto.id}).execute().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        console.log(result);
        return result;
    }

    async findCaseByCaseListId(isTask: boolean, envId: number, options: IPaginationOptions):Promise<Pagination<CaselistEntity>> {

        let queryBuilder;
        if (isTask && envId){
            queryBuilder = await this.caseListRepository.createQueryBuilder('caselist').where('caselist.isTask = :isTask',{isTask: isTask}).andWhere('caselist.env = :env',{env: envId}).
           leftJoinAndSelect('caselist.cases','cases').
           leftJoinAndSelect('cases.endpointObject','end').
           leftJoinAndSelect('caselist.env','env').
           leftJoinAndSelect('env.endpoints','endpoint').orderBy('caselist.updateDate', 'DESC');
       }else if (!isTask && envId){
            queryBuilder = await this.caseListRepository.createQueryBuilder('caselist').andWhere('caselist.env = :env',{env: envId}).
            leftJoinAndSelect('caselist.cases','cases').
            leftJoinAndSelect('cases.endpointObject','end').
            leftJoinAndSelect('caselist.env','env').
            leftJoinAndSelect('env.endpoints','endpoint').orderBy('caselist.updateDate', 'DESC');
        }else if (!isTask && !envId){
            queryBuilder = await this.caseListRepository.createQueryBuilder('caselist').
            leftJoinAndSelect('caselist.cases','cases').
            leftJoinAndSelect('cases.endpointObject','end').
            leftJoinAndSelect('caselist.env','env').
            leftJoinAndSelect('env.endpoints','endpoint').orderBy('caselist.updateDate', 'DESC');
        }else if (isTask && !envId){
            queryBuilder = await this.caseListRepository.createQueryBuilder('caselist').where('caselist.isTask = :isTask',{isTask: isTask}).
            leftJoinAndSelect('caselist.cases','cases').
            leftJoinAndSelect('cases.endpointObject','end').
            leftJoinAndSelect('caselist.env','env').
            leftJoinAndSelect('env.endpoints','endpoint').orderBy('caselist.updateDate', 'DESC');
        }

        return await paginate<CaselistEntity>(queryBuilder, options);
    }

    async deleteCaseList(caseListIdsDto: CaseListIdsDto){
        if (caseListIdsDto.ids.length == 0){
            return {};
        }
        for (const id of caseListIdsDto.ids){
            if (!CommonUtil.isNumber(id)){
                throw new ApiException(`数组值${id}必须为数字`, ApiErrorCode.PARAM_VALID_FAIL,HttpStatus.BAD_REQUEST);
            }
        }
        let res = [];
        for (const delId of caseListIdsDto.ids){
            const caseListObj = await this.caseListRepository.createQueryBuilder().select().where('id = :id',{id: delId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!caseListObj){
                throw new ApiException(`caselist ID:${delId}不存在`,ApiErrorCode.CASELIST_ID_INVALID, HttpStatus.BAD_REQUEST);
            }
           await this.caseListRepository.createQueryBuilder().delete().where('id = :id',{id: delId}).execute().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            res.push(
                {status: true,id: delId}
            );
        }
        return res;
    }
}
