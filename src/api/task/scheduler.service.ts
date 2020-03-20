import {Cron, SchedulerRegistry} from '@nestjs/schedule';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpException, HttpStatus} from '@nestjs/common';
import * as crypto from 'crypto';
import {CronJob} from 'cron';
import {SchedulerEntity} from './scheduler.entity';
import {EnvEntity} from '../env/env.entity';
import {TaskIdsDto, SIngleTaskDto} from './dto/scheduler.dto';
import {RunStatus} from './dto/run.status';
import {CommonUtil} from '../../util/common.util';
import {RunService} from '../run/run.service';
import {IRunCaseById} from '../run/run.interface';
import {Executor} from '../history/dto/history.enum';
import {CaseGrade, CaseType} from "../case/dto/case.dto";
import {CaseEntity} from "../case/case.entity";

var parser = require('cron-parser');

export class SchedulerService {

    constructor(private readonly schedulerRegistry: SchedulerRegistry,
                @InjectRepository(SchedulerEntity)
                private readonly scheRepository: Repository<SchedulerEntity>,
                @InjectRepository(EnvEntity)
                private readonly envRepository: Repository<EnvEntity>,
                @InjectRepository(CaseEntity)
                private readonly caseRepository: Repository<CaseEntity>,
                private readonly runService: RunService) {
    }


    /**
     * 获取所有运行中的定时任务
     */
    async getAllJobs(runStatus: RunStatus) {
        if (runStatus == null){
            const schObj: SchedulerEntity[] = await this.scheRepository.createQueryBuilder().getMany().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            )
            return schObj
        }else {
            const schObj: SchedulerEntity[] = await this.scheRepository.createQueryBuilder('sch').
            where('sch.status = :status',{status: runStatus}).getMany().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            )
            return schObj
        }

    }

    /**
     * 删除定时任务
     * @param deleteRunningTaskDto
     */
    async deleteJob(taskIdsDto: TaskIdsDto) {
        try {
            for (const id of taskIdsDto.ids) {
                const schObj = await this.scheRepository.findOne(id).catch(
                    err => {
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                )
                const jobs = await this.getAllJobs(RunStatus.RUNNING);
                for (const job of jobs) {
                    if (job.id == schObj.id){
                        await this.schedulerRegistry.deleteCronJob(schObj.md5);
                    }
                }
                const delSchedulerObj = await this.scheRepository.createQueryBuilder().update(SchedulerEntity).
                set({status: RunStatus.DELETE}).where('id = :id', {id: schObj.id}).execute().catch(
                    err => {
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                );
                if (!delSchedulerObj) {
                    throw new ApiException(`删除的任务id:${schObj.id}不存在`, ApiErrorCode.SCHEDULER_MD5_INVAILD, HttpStatus.BAD_REQUEST);
                }

            }
        } catch (e) {
            throw new HttpException('定时任务删除异常', HttpStatus.BAD_REQUEST);
        }
        return {status: true};

    }

    /**
     * 停止运行中的定时任务
     * @param deleteRunningTaskDto
     */
    async stopJob(taskIdsDto: TaskIdsDto) {
        let stopSuccess = [];
        let stopFail = [];
        for (const id of taskIdsDto.ids) {
            const task = await this.scheRepository.findOne(id).catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!task) {
                throw new ApiException(`停止的任务id:${id}不存在`, ApiErrorCode.SCHEDULER_MD5_INVAILD, HttpStatus.BAD_REQUEST);
            }
            if (task.status != RunStatus.RUNNING){
                throw new ApiException(`定时任务已停止或删除`,ApiErrorCode.SCHEDULER_STOP_OR_DELETE, HttpStatus.BAD_REQUEST);
            }
            try {
                this.schedulerRegistry.getCronJob(task.md5).stop();
                await this.scheRepository.createQueryBuilder().update(SchedulerEntity).
                set({status: RunStatus.STOP}).where('id = :id', {id: task.id}).execute().catch(
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


    /**
     * 删除系统定时任务
     */
    async delCheckJobTask(){
        try {
            await this.schedulerRegistry.getCronJob('checkStatus').stop();
        }catch (e) {
            return {status: false};
        }

        return {status: true};
    }

    /**
     * 删除系统定时任务
     */
    async restartSystemCheckJobTask(){
        try {
            await this.schedulerRegistry.getCronJob('checkStatus').start();
        }catch (e) {
            return {status: false};
        }

        return {status: true};
    }

    /**
     * 重启定时任务
     */
    async restartCheckJobTask(taskIdsDto: TaskIdsDto){
        console.log(taskIdsDto.ids)
        const schObjList: SchedulerEntity[] = await this.scheRepository.createQueryBuilder('sch').
        where('sch.id IN (:...ids)',{ids:taskIdsDto.ids}).getMany().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        console.log(JSON.stringify(schObjList))
        let resultList = [];
        for (let schedulerEntity of schObjList) {
            if (schedulerEntity.status != RunStatus.RUNNING){
                try {
                    await this.schedulerRegistry.getCronJob(schedulerEntity.md5).start();
                    await this.scheRepository.createQueryBuilder().update(SchedulerEntity).
                    set({status: RunStatus.RUNNING}).where('id = :id', {id: schedulerEntity.id}).execute().catch(
                        err => {
                            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                        }
                    )
                    resultList.push({id: schedulerEntity.id,result:true})
                }catch (e) {
                    console.log('--------------------')
                    console.log(e)
                    resultList.push({id: schedulerEntity.id,result:false, msg: e})

                }

            }
        }

        return resultList;
    }

    /**
     * 添加单接口定时任务
     * @param singleTaskDto
     */
    async addRunSingleTask(singleTaskDto: SIngleTaskDto){
        let caseGrade;
        let envId;
        if (singleTaskDto.caseGrade == null){
            caseGrade = CaseGrade.LOW;
        }else {
            caseGrade = singleTaskDto.caseGrade;
        }
        if (!singleTaskDto.envId){
            envId = 5;
        }else {
            envId = singleTaskDto.envId;
        }
        const caseList:CaseEntity[] = await this.caseRepository.createQueryBuilder('cas').
        where('cas.caseGrade = :caseGrade',{caseGrade: caseGrade}).andWhere(
            'cas.caseType = :caseType',{caseType:CaseType.SINGLE}
        ).getMany().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        if(caseList.length == 0 || caseList == null){
            throw new ApiException("需要执行的接口列表为空",ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        let caseIds = [];
        caseList.forEach(
            caseObj => {
                caseIds.push(caseObj.id);
            }
        );
        console.log('运行的定时任务接口：'+caseIds)
        const caseListDto = new RunCaseListDto(caseIds, envId, Executor.SCHEDULER, singleTaskDto.token);
        const secheduler = new SchedulerEntity();
        const createDate = new Date();
        const md5 = crypto.createHmac('sha256', createDate + CommonUtil.randomChar(10)).digest('hex');
        const scheObj = await this.scheRepository.createQueryBuilder().select().where('md5 = :md5', {md5: md5}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        if (scheObj) {
            throw new ApiException(`定时任务md5:${md5}已存在,不能重复`, ApiErrorCode.SCHEDULER_MD5_REPEAT, HttpStatus.BAD_REQUEST);
        }
        secheduler.name = singleTaskDto.name;
        secheduler.md5 = md5;
        secheduler.createDate = createDate;
        secheduler.env = await this.envRepository.findOne(envId);
        secheduler.cron = singleTaskDto.cron;
        secheduler.status = RunStatus.RUNNING;
        await this.scheRepository.createQueryBuilder().insert().into(SchedulerEntity).values(secheduler).execute().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        const job = new CronJob(singleTaskDto.cron, () => {
             this.runService.runCaseById(caseListDto);
        });
        this.schedulerRegistry.addCronJob(md5, job);
        job.start();
        return secheduler;
    }

    /**
     * 检查crom表达式
     * @param cron
     */
    async checkCron(cron: string){
        if (cron == null || cron == ""){
            throw new ApiException(`cron不能为空`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
        }
        try {
            var result = parser.parseExpression(cron);
            return {result: true};
        }catch (e) {
            return {result: false};
        }
    }

    /**
     * 排查定时任务库，确认定时任务是否存活
     *
     */
    @Cron('* * * * * *',{name:'checkStatus'})
    async checkJobRunStatus() {
        console.log('------------------------排查定时任务--------------------')
        const runningSchObj: SchedulerEntity[] = await this.scheRepository.createQueryBuilder('sch').
        where('sch.status = :status',{status: RunStatus.RUNNING}).getMany().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        const jobs = this.schedulerRegistry.getCronJobs();
        let md5List = [];
        jobs.forEach(
            (k,v) =>{
                md5List.push(k);
            }
        );
        for (let runningSch of runningSchObj){
            if (md5List.indexOf(runningSch.md5) == -1){
                await this.scheRepository.createQueryBuilder().update(SchedulerEntity).
                set({status: RunStatus.STOP}).where('id = :id', {id: runningSch.id}).execute().catch(
                    err => {
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                );
            }
        }
    }
}

class RunCaseListDto implements IRunCaseById{

    readonly caseIds: number[];
    readonly envId: number;
    readonly executor: Executor;
    readonly token: string;

    constructor(private readonly cIds: number[], private readonly eId: number, private readonly exec: Executor, private readonly tk: string) {
        this.caseIds = cIds;
        this.envId = eId;
        this.executor = exec;
        this.token = tk;
    }





}
