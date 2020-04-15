import {Cron, SchedulerRegistry} from "@nestjs/schedule";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpException, HttpStatus} from "@nestjs/common";
import * as crypto from "crypto";
import {CronJob} from "cron";
import {SchedulerEntity} from "./scheduler.entity";
import {EnvEntity} from "../env/env.entity";
import {RunCaseListDto, SingleTaskDto, TaskIdsDto, UpdateTaskDto} from "./dto/scheduler.dto";
import {CommonUtil} from "../../utils/common.util";
import {RunService} from "../run/run.service";
import {CaseEntity} from "../case/case.entity";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {CaseGrade, Executor, RunStatus} from "../../config/base.enum";
import {findCaseByCaseGrade} from "../../datasource/case/case.sql";
import {
    findScheduleById,
    findScheduleByStatus,
    findSchedulerOfCaseAndEnvById,
    findSchedulerOfCaseAndEnvByIds,
    saveScheduler,
    updateScheduler,
    updateSchedulerRunStatus
} from "../../datasource/scheduler/scheduler.sql";
import {findEnvById} from "../../datasource/env/env.sql";

var parser = require("cron-parser");

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
     * 根据状态获取所有的定时任务
     */
    async getAllJobs(runStatus: RunStatus, options: IPaginationOptions) {
        let queryBuilder = await findScheduleByStatus(this.scheRepository, runStatus);
        return await paginate<SchedulerEntity>(queryBuilder, options);
    }

    /**
     * 删除定时任务
     * @param taskIdsDto
     */
    async deleteJob(taskIdsDto: TaskIdsDto) {
        try {
            for (const id of taskIdsDto.ids) {
                const schObj = await findScheduleById(this.scheRepository, id);
                if (schObj.status == RunStatus.RUNNING) await this.schedulerRegistry.deleteCronJob(schObj.md5);
                const delSchedulerObj = await updateSchedulerRunStatus(this.scheRepository, RunStatus.DELETE, id);
            }
        } catch (e) {
            throw new HttpException("定时任务删除异常", HttpStatus.BAD_REQUEST);
        }
        return {status: true};

    }

    /**
     * 停止运行中的定时任务
     * @param taskIdsDto
     */
    async stopJob(taskIdsDto: TaskIdsDto) {
        let stopSuccess = [];
        let stopFail = [];
        for (const id of taskIdsDto.ids) {
            const task = await findScheduleById(this.scheRepository, id);
            if (!task) throw new ApiException(`停止的任务id:${id}不存在`, ApiErrorCode.SCHEDULER_MD5_INVAILD, HttpStatus.BAD_REQUEST);
            if (this.isExistTask(task.md5)) {
                try {
                    await this.schedulerRegistry.getCronJob(task.md5).stop();
                    await updateSchedulerRunStatus(this.scheRepository, RunStatus.STOP, id);
                    stopSuccess.push(task.id);
                } catch (e) {
                    stopFail.push(task.id);
                }
            } else {
                await updateSchedulerRunStatus(this.scheRepository, RunStatus.STOP, id);
            }
        }
        return {success: stopSuccess, fail: stopFail};
    }


    /**
     * 删除系统定时任务
     */
    async delCheckJobTask() {
        try {
            await this.schedulerRegistry.getCronJob("checkStatus").stop();
        } catch (e) {
            return {status: false};
        }
        return {status: true};
    }

    /**
     * 删除系统定时任务
     */
    async restartSystemCheckJobTask() {
        try {
            await this.schedulerRegistry.getCronJob("checkStatus").start();
        } catch (e) {
            return {status: false};
        }

        return {status: true};
    }

    /**
     * 重启定时任务
     */
    async restartCheckJobTask(taskIdsDto: TaskIdsDto) {
        const schObjList: SchedulerEntity[] = await findSchedulerOfCaseAndEnvByIds(this.scheRepository, taskIdsDto.ids);
        for (let schedulerEntity of schObjList) {
            if (this.isExistTask(schedulerEntity.md5)) {
                await this.schedulerRegistry.getCronJob(schedulerEntity.md5).stop();
                await this.schedulerRegistry.getCronJob(schedulerEntity.md5).start();
                if (!this.isExistTask(schedulerEntity.md5)) throw new ApiException(`重启定时任务失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                await updateSchedulerRunStatus(this.scheRepository, RunStatus.RUNNING, schedulerEntity.id);
            } else {
                const caseList = schedulerEntity.cases;
                let caseIds = caseList.map(cas => {
                    return cas.id
                });
                await this.runSingleTask(caseIds, schedulerEntity.env.id, schedulerEntity.cron, schedulerEntity.md5);
                if (!this.isExistTask(schedulerEntity.md5)) {
                    throw new ApiException(`重启定时任务失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                }
                await updateSchedulerRunStatus(this.scheRepository, RunStatus.RUNNING, schedulerEntity.id);

            }
        }
        return true;
    }

    /**
     * 添加单接口定时任务
     * @param singleTaskDto
     */
    async addRunSingleTask(singleTaskDto: SingleTaskDto) {
        const caseGrade = singleTaskDto.caseGrade == null ? CaseGrade.LOW : singleTaskDto.caseGrade;
        const envId = singleTaskDto.envId == null ? 5 : singleTaskDto.envId;

        let caseList: CaseEntity[] = await findCaseByCaseGrade(this.caseRepository, caseGrade);
        if (caseList.length == 0) {
            throw new ApiException("需要执行的接口列表为空", ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        let caseIds = caseList.map(cas => {
            return cas.id
        });
        console.log("运行的定时任务接口：" + caseIds);
        const scheduler = new SchedulerEntity();
        const createDate = new Date();
        const md5 = crypto.createHmac("sha256", createDate + CommonUtil.randomChar(10)).digest("hex");
        const scheObj = await this.scheRepository.createQueryBuilder().select().where("md5 = :md5", {md5: md5}).getOne().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        if (scheObj) {
            throw new ApiException(`定时任务md5:${md5}已存在,不能重复`, ApiErrorCode.SCHEDULER_MD5_REPEAT, HttpStatus.BAD_REQUEST);
        }
        scheduler.name = singleTaskDto.name;
        scheduler.md5 = md5;
        scheduler.createDate = createDate;
        scheduler.env = await this.envRepository.findOne(envId);
        scheduler.cron = singleTaskDto.cron;
        scheduler.status = RunStatus.RUNNING;
        scheduler.cases = caseList;
        const result = await saveScheduler(this.scheRepository, scheduler);
        await this.runSingleTask(caseIds, scheduler.env.id, scheduler.cron, scheduler.md5);
        return {id: result.id};
    }


    /**
     * 更新定时任务
     * @param updateTaskDto
     */
    async updateRunSingleTask(updateTaskDto: UpdateTaskDto) {
        const schObj = await findSchedulerOfCaseAndEnvById(this.scheRepository, updateTaskDto.id);
        if (!schObj) throw new ApiException(`定时任务id ${updateTaskDto.id}找不到`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
        const sObj = new SchedulerEntity();
        sObj.name = updateTaskDto.name != null ? updateTaskDto.name : schObj.name;
        sObj.cron = updateTaskDto.cron != null ? updateTaskDto.cron : schObj.cron;
        sObj.env = updateTaskDto.envId != null ? await findEnvById(this.envRepository, updateTaskDto.envId) : schObj.env;
        sObj.status = RunStatus.RUNNING;
        const result = await updateScheduler(this.scheRepository, sObj, updateTaskDto.id);
        if (updateTaskDto.isRestart) {
            try {
                if (this.isExistTask(schObj.md5)) {
                    await this.schedulerRegistry.getCronJob(schObj.md5).stop();
                    await this.schedulerRegistry.getCronJob(schObj.md5).start();
                    if (!this.isExistTask(schObj.md5)) throw new ApiException(`重启定时任务失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                    await updateSchedulerRunStatus(this.scheRepository, RunStatus.RUNNING, updateTaskDto.id);
                } else {
                    let caseIds = schObj.cases.map(cas => {
                        return cas.id;
                    });
                    await this.runSingleTask(caseIds, schObj.env.id, schObj.cron, schObj.md5);
                    if (!this.isExistTask(schObj.md5)) throw new ApiException(`重启定时任务失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                    await updateSchedulerRunStatus(this.scheRepository, RunStatus.RUNNING, updateTaskDto.id);
                }
            } catch (e) {
                throw new ApiException(e, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            }
        }
        if (result.affected == 1) {
            return {status: true};
        } else {
            return {status: false};
        }
    }

    /**
     * 检查cron表达式
     * @param cron
     */
    async checkCron(cron: string) {
        if (cron == null || cron == "") {
            throw new ApiException(`cron不能为空`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
        }
        try {
            var result = parser.parseExpression(cron);
            return {result: true};
        } catch (e) {
            return {result: false};
        }
    }

    /**
     * 排查定时任务库，确认定时任务是否存活
     *
     */
    @Cron("0 0/10 * * * *", {name: "checkStatus"})
    async checkJobRunStatus() {
        //console.log('------------------------排查定时任务--------------------')
        const runningSchObj: SchedulerEntity[] = await this.scheRepository.createQueryBuilder("sch").where("sch.status = :status", {status: RunStatus.RUNNING}).getMany().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        let md5List = [];
        const jobs = this.schedulerRegistry.getCronJobs();
        jobs.forEach((value, key, map) => {
            let next;
            try {
                next = value.nextDates().toDate();
            } catch (e) {
                next = "error: next fire date is in the past!";
            }
            md5List.push(key);
        });
        // console.log('定时任务中的md5列表'+JSON.stringify(runningSchObj))
        for (let runningSch of runningSchObj) {
            if (md5List.indexOf(runningSch.md5) == -1) {
                await this.scheRepository.createQueryBuilder().update(SchedulerEntity).set({status: RunStatus.STOP}).where("id = :id", {id: runningSch.id}).execute().catch(
                    err => {
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                );
            }
        }
    }


    /**
     * 运行单接口任务
     * @param caseIds
     * @param envId
     * @param cron
     * @param md5
     */
    private async runSingleTask(caseIds: number[], envId, cron, md5) {
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
    private async runSceneTask(sch: SchedulerEntity) {
        // let caseIds = sch.cases.map(cas => {cas.id});
        // //const caseListDto = new RunCaseListDto(caseIds, sch.env.id, Executor.SCHEDULER);
        // const job = new CronJob(sch.cron, () => {
        //   this.runService.runCaseById(caseListDto);
        // });
        // this.schedulerRegistry.addCronJob(sch.md5, job);
        // job.start();
    }

    private isExistTask(md5) {
        try {
            this.schedulerRegistry.getCronJob(md5);
            return true;
        } catch (e) {
            return false;
        }
    }
}
