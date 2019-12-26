import {InjectRepository} from '@nestjs/typeorm';
import {CaseEntity} from '../case/case.entity';
import {Repository} from 'typeorm';
import {CaselistEntity} from './caselist.entity';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import {AddCaseListDto} from '../case/dto/case.dto';

export class CaselistService {

    constructor(
        @InjectRepository(CaseEntity)
        private readonly caseRepository: Repository<CaseEntity>,
        @InjectRepository(CaselistEntity)
        private readonly caseListRepository: Repository<CaselistEntity>,
    ) {
    }


    async addCaseList(addCaseListDto: AddCaseListDto){

        const caseListOBj = new CaselistEntity();
        caseListOBj.name = addCaseListDto.caseListName;

        if (addCaseListDto.cron){
            caseListOBj.cron = addCaseListDto.cron;
            caseListOBj.isTask = true;
        }
        if (addCaseListDto.desc){
            caseListOBj.desc = addCaseListDto.desc;
        }
        let addCaseListIds = [];
        if (addCaseListDto.ids.indexOf(',') != -1){
            addCaseListIds = addCaseListDto.ids.split(',');
        }else {
            addCaseListIds.push(addCaseListDto.ids);
        }

        let caseList = [];
        for (const addId of addCaseListIds){
            const caseObj = await this.caseRepository.createQueryBuilder().select().where('id = :id',{id:addId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!caseObj){
                throw new ApiException(`添加用例case的ID:${addId}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
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

    async findCaseByCaseListId(caseListId: string){

        const result = await this.caseListRepository.createQueryBuilder('caselist').
        leftJoinAndSelect('caselist.cases','cases').
        leftJoinAndSelect('caselist.env','env').
        leftJoinAndSelect('env.endpoints','endpoint').getMany().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (caseListId == null){
            return result;
        }
        let findIds = [];
        if (caseListId.indexOf(',') != -1){
            findIds = caseListId.split(',');
        }else {
            findIds.push(caseListId);
        }
        for (const findId of findIds){
            const caseListObj = await this.caseListRepository.createQueryBuilder().select().where('id =  :id',{id: findId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!caseListObj){
                throw new ApiException(`查询用例ID:${findId}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
            }
        }

        let rs = [];
        for (const res of result){
            for (const findId of findIds){
                if (Number(res.id) == Number(findId)){
                    rs.push(res);
                }
            }
        }
        return rs;
    }

}
