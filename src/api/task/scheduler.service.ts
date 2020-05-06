import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { HttpException, HttpStatus } from "@nestjs/common";
import * as crypto from "crypto";
import { CronJob } from "cron";
import { SchedulerEntity } from "./scheduler.entity";
import { EnvEntity } from "../env/env.entity";
import { RunCaseListDto, SingleTaskDto, TaskIdsDto, UpdateTaskDto } from "./dto/scheduler.dto";
import { CommonUtil } from "../../utils/common.util";
import { RunService } from "../run/run.service";
import { CaseEntity } from "../case/case.entity";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";
import { CaseGrade, Executor, RunStatus, TaskType, JmeterRunStatus } from "../../config/base.enum";
import { findCaseByCaseGradeAndCatalogs } from "../../datasource/case/case.sql";
import {
    deleteSchedulerById,
    findAllTaskResult,
    findScheduleById,
    findScheduleByMd5,
    findScheduleByStatus,
    findScheduleListByStatus,
    findSchedulerOfCaseAndEnvById,
    findSchedulerOfCaseAndEnvByIds,
    findTaskResultById,
    saveScheduler,
    saveTaskResult,
    updateScheduler,
    updateSchedulerRunStatus
} from "../../datasource/scheduler/scheduler.sql";
import { findEnvById } from "../../datasource/env/env.sql";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { TaskResultEntity } from "./task_result.entity";
import { ConfigService } from "../../config/config.service";
import { findCatalogByIds } from "../../datasource/catalog/catalog.sql";
import { CatalogEntity } from "../catalog/catalog.entity";
import { findJmeterById, saveJmeterResult } from "src/datasource/jmeter/jmeter.sql";
import { JmeterEntity } from "../jmeter/jmeter.entity";
import { JmeterResultEntity } from "../jmeter/jmeter_result.entity";
import { exec } from "child_process";


var parser = require("cron-parser");

export class SchedulerService {

    constructor(private readonly schedulerRegistry: SchedulerRegistry,
        @InjectRepository(SchedulerEntity)
        private readonly scheRepository: Repository<SchedulerEntity>,
        @InjectRepository(EnvEntity)
        private readonly envRepository: Repository<EnvEntity>,
        @InjectRepository(CaseEntity)
        private readonly caseRepository: Repository<CaseEntity>,
        @InjectRepository(CatalogEntity)
        private readonly catalogRepository: Repository<CatalogEntity>,
        @InjectRepository(TaskResultEntity)
        private readonly taskResultRepository: Repository<TaskResultEntity>,
        @InjectRepository(JmeterEntity)
        private readonly jmeterRepository: Repository<JmeterEntity>,
        @InjectRepository(JmeterResultEntity)
        private readonly jmeterResultRepository: Repository<JmeterResultEntity>,
        @InjectQueue("dingdingProcessor") private readonly sendMessageQueue: Queue,
        private readonly runService: RunService) {
    }

    config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
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
                if (schObj.status == RunStatus.RUNNING) this.schedulerRegistry.deleteCronJob(schObj.md5);
                const delSchedulerObj = await deleteSchedulerById(this.scheRepository, RunStatus.DELETE, id);
            }
        } catch (e) {
            throw new HttpException("定时任务删除异常", HttpStatus.BAD_REQUEST);
        }
        return { status: true };

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
                    this.schedulerRegistry.getCronJob(task.md5).stop();
                    await updateSchedulerRunStatus(this.scheRepository, RunStatus.STOP, id);
                    stopSuccess.push(task.id);
                } catch (e) {
                    stopFail.push(task.id);
                }
            } else {
                await updateSchedulerRunStatus(this.scheRepository, RunStatus.STOP, id);
            }
        }
        return { success: stopSuccess, fail: stopFail };
    }


    /**
     * 删除系统定时任务
     */
    delCheckJobTask() {
        try {
            this.schedulerRegistry.getCronJob("checkStatus").stop();
        } catch (e) {
            return { status: false };
        }
        return { status: true };
    }

    /**
     * 删除系统定时任务
     */
    restartSystemCheckJobTask() {
        try {
            this.schedulerRegistry.getCronJob("checkStatus").start();
        } catch (e) {
            return { status: false };
        }

        return { status: true };
    }

    /**
     * 重启定时任务
     */
    async restartCheckJobTask(taskIdsDto: TaskIdsDto) {
        const schObjList: SchedulerEntity[] = await findSchedulerOfCaseAndEnvByIds(this.scheRepository, taskIdsDto.ids);
        for (let schedulerEntity of schObjList) {
            if (this.isExistTask(schedulerEntity.md5)) {
                this.schedulerRegistry.deleteCronJob(schedulerEntity.md5);
                this.schedulerRegistry.getCronJob(schedulerEntity.md5).start();
                if (!this.isExistTask(schedulerEntity.md5)) throw new ApiException(`重启定时任务失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                await updateSchedulerRunStatus(this.scheRepository, RunStatus.RUNNING, schedulerEntity.id);
            } else {
                const caseList = await findCaseByCaseGradeAndCatalogs(this.caseRepository, schedulerEntity.caseGrade,
                    schedulerEntity.catalogs.map(catalog => {
                        return catalog.id
                    }));
                let caseIds = caseList.map(cas => {
                    return cas.id;
                });
                if (schedulerEntity.taskType == TaskType.INTERFACE) {
                    await this.runSingleTask(caseIds, schedulerEntity.env.id, schedulerEntity.cron, schedulerEntity.md5);
                } else if (schedulerEntity.taskType == TaskType.JMETER) {
                    await this.runJmeterTask(caseIds, schedulerEntity.cron);
                }
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
        let caseList: CaseEntity[] = await findCaseByCaseGradeAndCatalogs(this.caseRepository, caseGrade, singleTaskDto.catalogIds);
        if (caseList.length == 0)
            throw new ApiException("需要执行的接口列表为空", ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        let caseIds = caseList.map(cas => {
            return cas.id;
        });
        console.log("运行的定时任务接口：" + caseIds);
        const scheduler = new SchedulerEntity();
        const createDate = new Date();
        const md5 = crypto.createHmac("sha256", createDate + CommonUtil.randomChar(10)).digest("hex");
        const scheObj = await findScheduleByMd5(this.scheRepository, md5);
        if (scheObj) {
            throw new ApiException(`定时任务md5:${md5}已存在,不能重复`, ApiErrorCode.SCHEDULER_MD5_REPEAT, HttpStatus.BAD_REQUEST);
        }
        if (singleTaskDto.isSendMessage != null) scheduler.isSendMessage = singleTaskDto.isSendMessage;
        if (singleTaskDto.taskType != null) scheduler.taskType = singleTaskDto.taskType;
        scheduler.catalogs = await findCatalogByIds(this.catalogRepository, singleTaskDto.catalogIds);
        scheduler.taskType = singleTaskDto.taskType != null ? singleTaskDto.taskType : TaskType.INTERFACE;
        scheduler.caseGrade = caseGrade;
        scheduler.name = singleTaskDto.name;
        scheduler.md5 = md5;
        scheduler.createDate = createDate;
        scheduler.env = await this.envRepository.findOne(envId);
        scheduler.cron = singleTaskDto.cron;
        scheduler.status = RunStatus.RUNNING;
        if (scheduler.taskType == TaskType.INTERFACE) {
            await this.runSingleTask(caseIds, scheduler.env.id, scheduler.cron, scheduler.md5);
        } else if (scheduler.taskType == TaskType.JMETER) {
            await this.runJmeterTask(caseIds, scheduler.cron);
        }
        CommonUtil.printLog2(JSON.stringify(scheduler))
        const result = await saveScheduler(this.scheRepository, scheduler);
        return { id: result.id };
    }


    /**
     * 更新定时任务
     * @param updateTaskDto
     */
    async updateRunSingleTask(updateTaskDto: UpdateTaskDto) {
        const schObj = await findSchedulerOfCaseAndEnvById(this.scheRepository, updateTaskDto.id);
        if (!schObj) throw new ApiException(`定时任务id ${updateTaskDto.id}找不到`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
        const sObj = new SchedulerEntity();
        //if (updateTaskDto.catalogIds != null) sObj.catalogs = await findCatalogByIds(this.catalogRepository, updateTaskDto.catalogIds);
        if (updateTaskDto.taskType != null) sObj.taskType = updateTaskDto.taskType;
        if (updateTaskDto.isSendMessage != null) sObj.isSendMessage = updateTaskDto.isSendMessage;
        if (updateTaskDto.caseGrade != null) sObj.caseGrade = updateTaskDto.caseGrade;
        if (updateTaskDto.isSendMessage != null) sObj.isSendMessage = updateTaskDto.isSendMessage;
        sObj.name = updateTaskDto.name != null ? updateTaskDto.name : schObj.name;
        sObj.cron = updateTaskDto.cron != null ? updateTaskDto.cron : schObj.cron;
        sObj.env = updateTaskDto.envId != null ? await findEnvById(this.envRepository, updateTaskDto.envId) : schObj.env;
        sObj.status = RunStatus.RUNNING;
        CommonUtil.printLog2(JSON.stringify(sObj))
        const result = await updateScheduler(this.scheRepository, sObj, updateTaskDto.id);
        if (updateTaskDto.isRestart) {
            const newSecheduler = await findSchedulerOfCaseAndEnvById(this.scheRepository, updateTaskDto.id);
            try {
                if (this.isExistTask(newSecheduler.md5)) {
                    console.log('存在旧的md5' + newSecheduler.md5)
                    this.schedulerRegistry.deleteCronJob(newSecheduler.md5);
                    if (this.isExistTask(newSecheduler.md5)) {
                        throw new ApiException('定时任务失败', ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                    }
                }
                const catalogIds = newSecheduler.catalogs.map(catalog => {
                    return catalog.id;
                });
                let caseList: CaseEntity[] = await findCaseByCaseGradeAndCatalogs(this.caseRepository, newSecheduler.caseGrade, catalogIds);
                let caseIds = caseList.map(cas => {
                    return cas.id;
                });
                if (newSecheduler.taskType == TaskType.INTERFACE) {
                    await this.runSingleTask(caseIds, newSecheduler.env.id, newSecheduler.cron, newSecheduler.md5);
                } else if (newSecheduler.taskType == TaskType.JMETER) {
                    await this.runJmeterTask(caseIds, newSecheduler.cron);
                }
                if (!this.isExistTask(newSecheduler.md5)) throw new ApiException(`重启定时任务失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                await updateSchedulerRunStatus(this.scheRepository, RunStatus.RUNNING, updateTaskDto.id);
            } catch (e) {
                console.log(e.stack)
                await updateSchedulerRunStatus(this.scheRepository, RunStatus.STOP, updateTaskDto.id);
                throw new ApiException(e, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            }
        }
        if (result.affected == 1) {
            return { status: true };
        } else {
            return { status: false };
        }
    }

    /**
     *
     * 检查cron表达式
     * @param cron
     */
    async checkCron(cron: string) {
        if (cron == null || cron == "") {
            throw new ApiException(`cron不能为空`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
        }
        try {
            var result = parser.parseExpression(cron);
            return { result: true };
        } catch (e) {
            return { result: false };
        }
    }

    /**
     * 排查定时任务库，确认定时任务是否存活
     *
     */
    //@Cron("* * * * * *", { name: "checkStatus" })
    async checkJobRunStatus() {
        //console.log('------------------------排查定时任务--------------------')
        const runningSchObj: SchedulerEntity[] = await findScheduleListByStatus(this.scheRepository, RunStatus.RUNNING);
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
        console.log("定时任务中的md5列表" + JSON.stringify(runningSchObj));
        for (let runningSch of runningSchObj) {
            if (md5List.indexOf(runningSch.md5) == -1) {
                await this.scheRepository.createQueryBuilder().update(SchedulerEntity).set({ status: RunStatus.STOP }).where("id = :id", { id: runningSch.id }).execute().catch(
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
        CommonUtil.printLog2(caseIds)
        const caseListDto = new RunCaseListDto(caseIds, envId, Executor.SCHEDULER);
        const job = new CronJob(cron, async () => {
            let result = await this.runService.runCaseById(caseListDto);
            const taskResult = new TaskResultEntity();
            taskResult.result = JSON.stringify(result);
            taskResult.scheduler = await findScheduleByMd5(this.scheRepository, md5);

            if (!taskResult.scheduler) throw new ApiException(`定时任务md5:${md5}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            const saveResult: TaskResultEntity = await saveTaskResult(this.taskResultRepository, taskResult);
            CommonUtil.printLog2(JSON.stringify(saveResult))
            if (taskResult.scheduler.isSendMessage) {
                const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
                this.sendMessageQueue.add("sendMessage", config.taskResultUrl + saveResult.id);
            }
        });
        this.schedulerRegistry.addCronJob(md5, job);
        job.start();
    }

    /**
     * 运行jmeter定时任务
     * @param caseIds
     * @param envId
     * @param cron
     * @param md5
     */
    private async runJmeterTask(jmeterId: number[], cron) {
        const jmeterBinPath = this.config.jmeterBinPath;
        const jmeterJtlPath = this.config.jmeterJtlPath;
        const jmeterLogPath = this.config.jmeterLogPath;

        const jmeter = await findJmeterById(this.jmeterRepository, jmeterId);
        const jmeterCountNum = jmeter.preCountNumber;
        const preCountTime = jmeter.preCountTime;
        const loopNum = jmeter.loopNum;
        const remote_address = jmeter.remote_address == null ? '' : '-R ' + jmeter.remote_address;

    
        //更新md5值
        const md5 = crypto.createHmac("sha256", new Date() + CommonUtil.randomChar(10)).digest("hex");

        const cmd = `${jmeterBinPath} -n -t ${jmeter}.jmx -Jconcurrent_number=${jmeterCountNum} -Jduration=${preCountTime} -Jcycles=${loopNum} -j ${jmeterLogPath}/${md5}.log -l ${jmeterJtlPath}/${md5}.jtl ${remote_address}`;
        console.log(cmd)
        let flag = true;
        const child = exec(cmd, { killSignal: "SIGINT" }, async (error, stdout, stderr) => {
            if (error) {
                flag = false;
                const jmeterResult = new JmeterResultEntity();
                jmeterResult.jmeter = jmeter;
                jmeterResult.md5 = md5;
                jmeterResult.jmeterRunStatus = JmeterRunStatus.FAIL;
                await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
                child.kill("SIGINT");
            }
        });

        child.stdout.on("close", async () => {
            if (flag) {
                const jmeterResult = new JmeterResultEntity();
                jmeterResult.jmeter = jmeter;
                jmeterResult.md5 = md5;
                jmeterResult.jmeterRunStatus = JmeterRunStatus.FINISH;
                await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
            }
        });

    }


    private isExistTask(md5) {
        try {
            this.schedulerRegistry.getCronJob(md5);
            return true;
        } catch (e) {
            return false;
        }
    }


    async getAllTaskResult(options: IPaginationOptions) {
        let queryBuilder = await findAllTaskResult(this.taskResultRepository);
        return (await paginate<TaskResultEntity>(queryBuilder, options)).items.map(obj => { return JSON.parse(obj.result) });
    }

    /**
     * 通过taskResultId查询定时任务执行结果
     * @param taskResultId
     */
    async getTaskResultByIdService(taskResultId: number) {
        const resultObj = await findTaskResultById(this.taskResultRepository, taskResultId);
        if (!resultObj) throw new ApiException(`报告ID:${taskResultId}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        resultObj.result = JSON.parse(resultObj.result);
        return resultObj;
    }

}
