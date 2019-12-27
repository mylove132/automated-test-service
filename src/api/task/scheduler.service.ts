import {SchedulerRegistry} from '@nestjs/schedule';
import {InjectRepository} from '@nestjs/typeorm';
import {CaselistEntity} from '../caselist/caselist.entity';
import {Repository} from 'typeorm';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import * as crypto from 'crypto';
import {CronJob} from 'cron';
import {SchedulerEntity} from './scheduler.entity';
import {EnvEntity} from '../env/env.entity';
import {AddCaselistTaskDto} from './dto/scheduler.dto';
import {RunStatus} from './dto/run.status';

export class SchedulerService {

    constructor(private readonly schedulerRegistry: SchedulerRegistry,
                @InjectRepository(SchedulerEntity)
                private readonly scheRepository: Repository<SchedulerEntity>,
                @InjectRepository(CaselistEntity)
                private readonly caseListRepository: Repository<CaselistEntity>,
                @InjectRepository(EnvEntity)
                private readonly envRepository: Repository<EnvEntity>,) {}

    async startTask(addCaselistTaskDto: AddCaselistTaskDto){
        let envIds = [];
        if (addCaselistTaskDto.envIds != null){
            if (addCaselistTaskDto.envIds.indexOf(',') != -1){
                envIds = addCaselistTaskDto.envIds.split(',');
            }else {
                envIds.push(addCaselistTaskDto.envIds);
            }
        }
        let result = [];
        if (envIds.length > 0){
            for (var envId of envIds){
                const envObj = await this.envRepository.createQueryBuilder().select().where('id=:id',{id: envId}).getOne().catch(
                    err => {
                        console.log(err);
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                );
                if (!envObj){
                    throw new ApiException(`环境ID:${envId}不存在`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                }
                let caseListIds = [];
                if (addCaselistTaskDto.caseListIds.indexOf(',') != -1){
                    caseListIds = addCaselistTaskDto.caseListIds.split(',');
                }else {
                    caseListIds.push(addCaselistTaskDto.caseListIds);
                }
                for (const caseListId of caseListIds){
                    const caseListObj = await this.caseListRepository.createQueryBuilder().select().where('id=:id',{id: caseListId}).getOne().catch(
                        err => {
                            console.log(err);
                            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                        }
                    );
                    if (!caseListObj){
                        throw new ApiException(`用例ID:${caseListId}不存在`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                    }
                    const secheduler = new SchedulerEntity();
                    const createDate = new Date();
                    const md5 = crypto.createHmac('sha256', caseListObj.id.toString()+createDate).digest('hex');
                    const scheObj = await this.scheRepository.createQueryBuilder().select().where('md5 = :md5',{md5: md5}).getOne().catch(
                        err => {
                            console.log(err);
                            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                        }
                    )
                    if (scheObj){
                        throw new ApiException(`定时任务md5:${md5}已存在`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                    }
                    secheduler.md5 = md5;
                    secheduler.createDate = createDate;
                    secheduler.env = envObj;
                    secheduler.caseList = caseListObj;
                    secheduler.status = RunStatus.RUNNING;
                    console.log(secheduler);
                    await this.scheRepository.createQueryBuilder().insert().into(SchedulerEntity).values(secheduler).execute().catch(
                        err => {
                            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                        }
                    );
                    const job = new CronJob(caseListObj.cron, () => {
                        this.runCaseList(envId, caseListId);
                    });
                    this.schedulerRegistry.addCronJob(md5, job);
                    job.start();
                    result.push(secheduler);
                }
            }
        }else {
            throw new ApiException('定时任务环境不能为空', ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        return result;
    }

    async getAllJobs(){
        const jobs = this.schedulerRegistry.getCronJobs();
        let result = [];
        for (const mp of jobs){
            const sechObj = await this.scheRepository.createQueryBuilder('seche').select().
            leftJoinAndSelect('seche.env','env').
            leftJoinAndSelect('seche.caseList', 'caseList').
            where('md5 = :md5',{md5: mp[0]}).getOne().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            )
            result.push(sechObj);
        }
        return result;
    }

    async getJobByMd5(md5: string){

    }

    private async runCaseList(envId, caseListId){
        console.log("定时任务环境:"+envId+"定时任务用例id："+caseListId);
    }
}
