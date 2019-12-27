import {Cron, SchedulerRegistry} from '@nestjs/schedule';
import {InjectRepository} from '@nestjs/typeorm';
import {CaselistEntity} from '../caselist/caselist.entity';
import {Repository} from 'typeorm';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpException, HttpStatus} from '@nestjs/common';
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
        const result = await this.scheRepository.createQueryBuilder('seche').select().
        leftJoinAndSelect('seche.env','env').
        leftJoinAndSelect('seche.caseList', 'caseList').where('status = :status',{status: RunStatus.RUNNING}).getMany().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        return result;
    }

    async deleteJob(md5s: string){
        if (md5s == null){
            throw new ApiException(`删除定时任务的md5值不能为空`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        try {
            let delMd5s = [];
            if (md5s.indexOf(',') != -1){
                delMd5s = md5s.split(',');
            }else {
                delMd5s.push(md5s);
            }
            for (const deLmd5 of delMd5s){
                this.schedulerRegistry.deleteCronJob(deLmd5);
                await this.scheRepository.createQueryBuilder().update(SchedulerEntity).set({status: RunStatus.DELETE}).where('md5 = :md5',{md5: deLmd5}).execute().catch(
                    err => {
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                )
            }
        }catch (e) {
            throw new HttpException('定时任务删除异常', HttpStatus.BAD_REQUEST);
        }
        return {status: true};

    }

    async stopJob(md5s: string){
        if (md5s == null){
            const tasks = await this.scheRepository.createQueryBuilder().select().where('status = :status',{status: RunStatus.RUNNING}).getMany().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            let stopSuccess = [];
            let stopFail = [];
            for (const task of tasks){
                try {
                    this.schedulerRegistry.getCronJob(task.md5).stop();
                    await this.scheRepository.createQueryBuilder().update(SchedulerEntity).set({status: RunStatus.STOP}).where('md5 = :md5',{md5: task.md5}).execute().catch(
                        err => {
                            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                        }
                    )
                    stopSuccess.push(task.id);
                }catch (e) {
                    stopFail.push(task.id);
                }

            }
            return {success: stopSuccess,fail: stopFail};
        }
        try {
            let delMd5s = [];
            if (md5s.indexOf(',') != -1){
                delMd5s = md5s.split(',');
            }else {
                delMd5s.push(md5s);
            }
            let stopSuccess = [];
            let stopFail = [];
            for (const deLmd5 of delMd5s){
                console.log(deLmd5);
                const sechObj = await this.scheRepository.createQueryBuilder().select().where('md5 = :md5',{md5: deLmd5}).getOne().catch(
                    err => {
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                );
                if (!sechObj){
                    throw new ApiException(`停止的md5:${deLmd5}不存在`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                }if (sechObj.status == RunStatus.STOP){
                    stopSuccess.push(sechObj.id);
                    continue;
                }
                try {
                    this.schedulerRegistry.getCronJob(deLmd5).stop();
                    await this.scheRepository.createQueryBuilder().update(SchedulerEntity).set({status: RunStatus.STOP}).where('md5 = :md5',{md5: deLmd5}).execute().catch(
                        err => {
                            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                        }
                    )
                    stopSuccess.push(sechObj.id);
                }catch (e) {
                    stopFail.push(sechObj.id);
                }

            }
            return {success: stopSuccess, fail: stopFail}
        }catch (e) {
            throw new HttpException(`停止定时任务异常:${e}`, HttpStatus.BAD_REQUEST);
        }
    }

    async restartTaskJob(){
            const sechuObj = await this.scheRepository.createQueryBuilder().select().where('status = :status',{status:RunStatus.RUNNING}).getMany().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (sechuObj.length > 0){
                for (const sechu of sechuObj){
                    let addCaselistTaskDto: AddCaselistTaskDto;
                    addCaselistTaskDto.caseListIds = sechu.caseList.id.toString();
                    addCaselistTaskDto.envIds = sechu.env.id.toString();
                    await this.startTask(addCaselistTaskDto);
                }
            }
    }


    async delCheckJobTask(){
        try {
            this.schedulerRegistry.getCronJob('checkStatus').stop();
        }catch (e) {
            return {status: false};
        }

        return {status: true};
    }


    @Cron('* * * * * *',{name:'checkStatus'})
    async checkJobRunStatus() {
        console.log('------------------------排查定时任务--------------------')
        const result = await this.scheRepository.createQueryBuilder('sechu').where('sechu.status = :status',{status: RunStatus.RUNNING}).getMany().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (result.length > 0){
            for (const res of result){
                try {
                    const sech = this.schedulerRegistry.getCronJob(res.md5);
                    if (!sech){
                        await this.scheRepository.createQueryBuilder().update(SchedulerEntity).set({status: RunStatus.DELETE}).where('id = :id',{id: res.id}).execute().catch(
                            err => {
                                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                            }
                        );
                    }else {
                        console.log(sech)
                        if (sech.running != true){
                            await this.scheRepository.createQueryBuilder().update(SchedulerEntity).set({status: RunStatus.STOP}).where('id = :id',{id: res.id}).execute().catch(
                                err => {
                                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                                }
                            );
                        }
                    }
                }catch (e) {
                    await this.scheRepository.createQueryBuilder().update(SchedulerEntity).set({status: RunStatus.DELETE}).where('id = :id',{id: res.id}).execute().catch(
                        err => {
                            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                        }
                    );
                }
            }
        }
    }

    private async runCaseList(envId, caseListId){
        console.log("定时任务环境:"+envId+"定时任务用例id："+caseListId);
    }
}
