import {SchedulerRegistry} from '@nestjs/schedule';
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
import {AddCaselistTaskDto, DeleteRunningTaskDto} from './dto/scheduler.dto';
import {RunStatus} from './dto/run.status';
import {CommonUtil} from '../../util/common.util';
import {RunService} from '../run/run.service';
import {IRunCaseList} from '../run/run.interface';
import {Executor} from '../history/dto/history.enum';

export class SchedulerService {

    constructor(private readonly schedulerRegistry: SchedulerRegistry,
                @InjectRepository(SchedulerEntity)
                private readonly scheRepository: Repository<SchedulerEntity>,
                @InjectRepository(CaselistEntity)
                private readonly caseListRepository: Repository<CaselistEntity>,
                @InjectRepository(EnvEntity)
                private readonly envRepository: Repository<EnvEntity>,
                private readonly runService: RunService) {
    }

    async startTask(addCaselistTaskDto: AddCaselistTaskDto) {

        let result = [];
        for (const envId of addCaselistTaskDto.envIds){
            const envObj = await this.envRepository.createQueryBuilder().select().where('id = :id',{id: envId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            )
            if (!envObj) {
                throw new ApiException(`环境ID:${envId}不存在`, ApiErrorCode.ENV_ID_INVALID, HttpStatus.BAD_REQUEST);
            }
            const caseListObj = await this.caseListRepository.createQueryBuilder().select().where('id = :id',{id: addCaselistTaskDto.caseListId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            )
            if (!caseListObj) {
                throw new ApiException(`用例ID:${addCaselistTaskDto.caseListId}不存在`, ApiErrorCode.CASELIST_ID_INVALID, HttpStatus.BAD_REQUEST);
            }
            const secheduler = new SchedulerEntity();
            const createDate = new Date();
            const md5 = crypto.createHmac('sha256', caseListObj.id.toString() + createDate + CommonUtil.randomChar(10)).digest('hex');
            const scheObj = await this.scheRepository.createQueryBuilder().select().where('md5 = :md5', {md5: md5}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            )
            if (scheObj) {
                throw new ApiException(`定时任务md5:${md5}已存在,不能重复`, ApiErrorCode.SCHEDULER_MD5_REPEAT, HttpStatus.BAD_REQUEST);
            }
            secheduler.md5 = md5;
            secheduler.createDate = createDate;
            secheduler.env = envObj;
            secheduler.caseList = caseListObj;
            secheduler.status = RunStatus.RUNNING;
            await this.scheRepository.createQueryBuilder().insert().into(SchedulerEntity).values(secheduler).execute().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            const job = new CronJob(caseListObj.cron, () => {
                this.runCaseList(envId, addCaselistTaskDto.caseListId);
            });
            this.schedulerRegistry.addCronJob(md5, job);
            job.start();
            result.push(secheduler);
        }
        return result;
    }

    async getAllJobs() {
        const allJobs = this.schedulerRegistry.getCronJobs();
        let md5List = [];
        for (const job of allJobs){
            md5List.push(job[0]);
        }
        let res = [];
        for (const md5 of md5List.filter(res => res != 'checkStatus')){
            const result = await this.scheRepository.createQueryBuilder('seche').select().
            leftJoinAndSelect('seche.env', 'env').
            leftJoinAndSelect('seche.caseList', 'caseList').
            where('md5 = :md5',{md5: md5}).getOne().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            res.push(result);
        }

        return res;
    }

    async deleteJob(deleteRunningTaskDto: DeleteRunningTaskDto) {
        try {
            for (const deLmd5 of deleteRunningTaskDto.md5List) {
                const delSchedulerObj = await this.scheRepository.createQueryBuilder().update(SchedulerEntity).set({status: RunStatus.DELETE}).where('md5 = :md5', {md5: deLmd5}).execute().catch(
                    err => {
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                );
                if (!delSchedulerObj) {
                    throw new ApiException(`删除的任务名称:${deLmd5}不存在`, ApiErrorCode.SCHEDULER_MD5_INVAILD, HttpStatus.BAD_REQUEST);
                }
                this.schedulerRegistry.deleteCronJob(deLmd5);
            }
        } catch (e) {
            throw new HttpException('定时任务删除异常', HttpStatus.BAD_REQUEST);
        }
        return {status: true};

    }

    async stopJob(deleteRunningTaskDto: DeleteRunningTaskDto) {
        let stopSuccess = [];
        let stopFail = [];
        for (const md5 of deleteRunningTaskDto.md5List) {
            const task = await this.scheRepository.createQueryBuilder().select().where('md5 = :md5', {md5: md5}).getOne().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!task) {
                throw new ApiException(`停止的任务名称:${md5}不存在`, ApiErrorCode.SCHEDULER_MD5_INVAILD, HttpStatus.BAD_REQUEST);
            }
            if (task.status != RunStatus.RUNNING){
                throw new ApiException(`定时任务已停止或删除`,ApiErrorCode.SCHEDULER_STOP_OR_DELETE, HttpStatus.BAD_REQUEST);
            }
            try {
                this.schedulerRegistry.getCronJob(task.md5).stop();
                await this.scheRepository.createQueryBuilder().update(SchedulerEntity).set({status: RunStatus.STOP}).where('md5 = :md5', {md5: task}).execute().catch(
                    err => {
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                )
                stopSuccess.push(task.id);
            } catch (e) {
                stopFail.push(task.id);
            }

        }
        return {success: stopSuccess, fail: stopFail};
    }


    async delCheckJobTask(){
        try {
            this.schedulerRegistry.getCronJob('checkStatus').stop();
        }catch (e) {
            return {status: false};
        }

        return {status: true};
    }


    //@Cron('* * * * * *',{name:'checkStatus'})
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
        const caseListDto = new RunCaseListDto(caseListId, envId, Executor.SCHEDULER);
        await this.runService.runCaseListById(caseListDto);
        console.log("定时任务环境:"+envId+"定时任务用例id："+caseListId);

    }
}

class RunCaseListDto implements IRunCaseList{
    readonly caseListId: number;
    readonly envId: number;
    readonly executor: Executor;

    constructor(private readonly clId: number, private readonly eId: number, private readonly exec: Executor) {
        this.caseListId = clId;
        this.envId = eId;
        this.executor = exec;
    }



}
