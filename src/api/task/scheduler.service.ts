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
import {SIngleTaskDto, TaskIdsDto, UpdateTaskDto} from './dto/scheduler.dto';
import {RunStatus, TaskType} from './dto/run.status';
import {CommonUtil} from '../../utils/common.util';
import {RunService} from '../run/run.service';
import {IRunCaseById} from '../run/run.interface';
import {Executor} from '../history/dto/history.enum';
import {CaseGrade, CaseType} from "../case/dto/case.dto";
import {CaseEntity} from "../case/case.entity";
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';

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
     * 分页信息
     * @param options
     */
    async paginate(options: IPaginationOptions): Promise<Pagination<SchedulerEntity>> {
        return await paginate<SchedulerEntity>(this.scheRepository, options);
    }

    /**
     * 获取所有运行中的定时任务
     */
    async getAllJobs(runStatus: RunStatus, options: IPaginationOptions) {
        let queryBuilder;
        if (runStatus == null){
             queryBuilder = await this.scheRepository.createQueryBuilder();
        }else {
             queryBuilder = await this.scheRepository.createQueryBuilder('sch').
            where('sch.status = :status',{status: runStatus});
        }
        return await paginate<SchedulerEntity>(queryBuilder, options);
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
                if(schObj.status == RunStatus.RUNNING){
                    await this.schedulerRegistry.deleteCronJob(schObj.md5);
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
        leftJoinAndSelect('sch.cases','cases').
        leftJoinAndSelect('sch.env','env').
        where('sch.id IN (:...ids)',{ids:taskIdsDto.ids}).getMany().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        let resultList = [];
        for (let schedulerEntity of schObjList) {
            if (this.isExistTask(schedulerEntity.md5)){
                await this.schedulerRegistry.getCronJob(schedulerEntity.md5).stop();
                await this.schedulerRegistry.getCronJob(schedulerEntity.md5).start();
                if (!this.isExistTask(schedulerEntity.md5)){
                    throw new ApiException(`重启定时任务失败`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                }
                await this.scheRepository.createQueryBuilder().update(SchedulerEntity).
                set({status: RunStatus.RUNNING}).where('id = :id', {id: schedulerEntity.id}).execute().catch(
                    err => {
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                )
            }else {
                if (schedulerEntity.taskType == TaskType.SINGLE){
                    console.log(schedulerEntity)
                    const caseList = schedulerEntity.cases;
                    let caseIds = [];
                    caseList.forEach(
                        cas => {
                            caseIds.push(cas.id);
                        }
                    )
                    await this.runSingleTask(caseIds,schedulerEntity.env.id,schedulerEntity.cron,schedulerEntity.md5);
                    if (!this.isExistTask(schedulerEntity.md5)){
                        throw new ApiException(`重启定时任务失败`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                    }
                    await this.scheRepository.createQueryBuilder().update(SchedulerEntity).
                    set({status: RunStatus.RUNNING}).
                    where('id = :id', {id: schedulerEntity.id}).execute().catch(
                        err => {
                            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                        }
                    )
                }else if (schedulerEntity.taskType == TaskType.SCENE){
                    //场景任务
                    this.runSceneTask(schedulerEntity);
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
        let caseList: CaseEntity[];
        if (singleTaskDto.caseType == CaseType.SINGLE){
            caseList = await this.caseRepository.createQueryBuilder('cas').
            where('cas.caseGrade = :caseGrade',{caseGrade: caseGrade}).andWhere(
                'cas.caseType IN (:...caseType)',{caseType:[CaseType.SINGLE, CaseType.BLEND]}
            ).getMany().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            )
        }else if (singleTaskDto.caseType == CaseType.SCENE) {
            caseList = await this.caseRepository.createQueryBuilder('cas').
            where('cas.caseGrade = :caseGrade',{caseGrade: caseGrade}).andWhere(
                'cas.caseType IN (:...caseType)',{caseType:[CaseType.SCENE, CaseType.BLEND]}
            ).getMany().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            )
        }

        if(caseList.length == 0){
            throw new ApiException("需要执行的接口列表为空",ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        let caseIds = [];
        caseList.forEach(
            caseObj => {
                caseIds.push(caseObj.id);
            }
        );
        console.log('运行的定时任务接口：'+caseIds)
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
        secheduler.taskType = singleTaskDto.taskType != null ? singleTaskDto.taskType : TaskType.SINGLE;
        secheduler.name = singleTaskDto.name;
        secheduler.md5 = md5;
        secheduler.createDate = createDate;
        secheduler.env = await this.envRepository.findOne(envId);
        secheduler.cron = singleTaskDto.cron;
        secheduler.status = RunStatus.RUNNING;
        secheduler.cases = caseList;
        const result = await this.scheRepository.save(secheduler).catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        switch (secheduler.taskType) {
            case TaskType.SINGLE:
                await this.runSingleTask(caseIds,secheduler.env.id,secheduler.cron,secheduler.md5);
                break;
            case TaskType.SCENE:
                await this.runSceneTask(secheduler);
                break;
        }
        return {id: result.id};
    }


    /**
     * 更新定时任务
     * @param updateTaskDto
     */
    async updateRunSingleTask(updateTaskDto: UpdateTaskDto) {
        const schObj = await this.scheRepository.createQueryBuilder('sch').
        leftJoinAndSelect('sch.cases','cases').
        leftJoinAndSelect('sch.env','env').where('sch.id = :id',{id: updateTaskDto.id}).
        getOne().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (!schObj){
            throw new ApiException(`定时任务id ${updateTaskDto.id}找不到`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
        }
        schObj.name = updateTaskDto.name != null ? updateTaskDto.name : schObj.name;
        schObj.cron = updateTaskDto.cron != null ? updateTaskDto.cron : schObj.cron;
        if (updateTaskDto.isRestart){
            schObj.status = RunStatus.RUNNING;
        }
        schObj.env = updateTaskDto.envId != null ? await this.envRepository.findOne(updateTaskDto.envId) : schObj.env;
        const result = await this.scheRepository.createQueryBuilder().update(SchedulerEntity).set({
            "name": schObj.name,
            "cron": schObj.cron,
            "env": schObj.env,
        }).
        where("id = :id", { id: updateTaskDto.id }).execute();
        if (updateTaskDto.isRestart){
            try {
               if (this.isExistTask(schObj.md5)){
                   await this.schedulerRegistry.getCronJob(schObj.md5).stop();
                   await this.schedulerRegistry.getCronJob(schObj.md5).start();
                   if (!this.isExistTask(schObj.md5)){
                       throw new ApiException(`重启定时任务失败`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                   }
                   await this.scheRepository.createQueryBuilder().update(SchedulerEntity).
                   set({status: RunStatus.RUNNING}).where('id = :id', {id: updateTaskDto.id}).execute().catch(
                       err => {
                           throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                       }
                   );
               }else {
                  if (schObj.taskType == TaskType.SINGLE){
                      let caseIds = [];
                      schObj.cases.forEach(
                          cas => {
                              caseIds.push(cas.id);
                          }
                      )
                      await this.runSingleTask(caseIds,schObj.env.id,schObj.cron,schObj.md5);
                      if (!this.isExistTask(schObj.md5)){
                          throw new ApiException(`重启定时任务失败`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                      }
                      await this.scheRepository.createQueryBuilder().update(SchedulerEntity).
                      set({status: RunStatus.RUNNING}).where('id = :id', {id: updateTaskDto.id}).execute().catch(
                          err => {
                              throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                          }
                      );
                  }else if (schObj.taskType == TaskType.SCENE){
                      //场景任务
                      this.runSceneTask(schObj);
                  }
               }
            }catch (e) {
                throw new ApiException(e, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            }

        }
        if (result.affected == 1){
            return {status: true};
        }else {
            return {status: false};
        }
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
    //@Cron('* * * * * *',{name:'checkStatus'})
    async checkJobRunStatus() {
        console.log('------------------------排查定时任务--------------------')
        const runningSchObj: SchedulerEntity[] = await this.scheRepository.createQueryBuilder('sch').
        where('sch.status = :status',{status: RunStatus.RUNNING}).getMany().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        let md5List = [];
        const jobs = this.schedulerRegistry.getCronJobs();
        jobs.forEach((value, key, map) => {
            let next;
            try {
                next = value.nextDates().toDate();
            } catch (e) {
                next = 'error: next fire date is in the past!';
            }
            md5List.push(key);
        });
        console.log('定时任务中的md5列表'+JSON.stringify(runningSchObj))
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


    /**
     * 运行单接口任务
     * @param sch
     */
    private async runSingleTask(caseIds: number[], envId, cron, md5){
        const caseListDto = new RunCaseListDto(caseIds, envId, Executor.SCHEDULER);
        const job = new CronJob(cron, () => {
            this.runService.runCaseById(caseListDto);
        });
        this.schedulerRegistry.addCronJob(md5, job);
        job.start();
    }

    /**
     * 运行场景任务
     * @param sch
     */
    private async runSceneTask(sch: SchedulerEntity){
        let caseIds = [];
        sch.cases.forEach(
            cas => {
                caseIds.push(cas.id);
            }
        );
        const caseListDto = new RunCaseListDto(caseIds, sch.env.id, Executor.SCHEDULER);
        const job = new CronJob(sch.cron, () => {
            this.runService.runCaseById(caseListDto);
        });
        this.schedulerRegistry.addCronJob(sch.md5, job);
        job.start();
    }

    private isExistTask(md5){
        try {
            this.schedulerRegistry.getCronJob(md5);
            return true;
        }catch (e) {
            return false;
        }
    }
}




class RunCaseListDto implements IRunCaseById{

    readonly caseIds: number[];
    readonly envId: number;
    readonly executor: Executor;

    constructor(private readonly cIds: number[], private readonly eId: number, private readonly exec: Executor) {
        this.caseIds = cIds;
        this.envId = eId;
        this.executor = exec;
    }





}
