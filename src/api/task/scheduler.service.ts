import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { HttpException, HttpStatus, HttpService } from "@nestjs/common";
import * as crypto from "crypto";
import { SchedulerEntity } from "./scheduler.entity";
import { EnvEntity } from "../env/env.entity";
import { RunCaseListDto, AddTaskDto, TaskIdsDto, UpdateTaskDto } from "./dto/scheduler.dto";
import { CommonUtil } from "../../utils/common.util";
import { RunService } from "../run/run.service";
import { CaseEntity } from "../case/case.entity";
import { Logger } from '../../utils/log4js';
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";
import { CaseGrade, Executor, RunStatus, TaskType, JmeterRunStatus } from "../../config/base.enum";
import { findCaseByCaseGradeAndCatalogs } from "../../datasource/case/case.sql";
import {
    deleteSchedulerById,
    findAllTaskResult,
    findScheduleById,
    findScheduleByMd5,
    findScheduleByStatus,
    findSchedulerOfCaseAndEnvById,
    findSchedulerOfCaseAndEnvByIds,
    findTaskResultById,
    saveScheduler,
    saveTaskResult,
    updateScheduler,
    updateSchedulerRunStatus,
    findScheduleRuningIds
} from "../../datasource/scheduler/scheduler.sql";
import { findEnvById } from "../../datasource/env/env.sql";
import { TaskResultEntity } from "./task_result.entity";
import { ConfigService } from "../../config/config.service";
import { findCatalogByIds } from "../../datasource/catalog/catalog.sql";
import { CatalogEntity } from "../catalog/catalog.entity";
import { findJmeterById, saveJmeterResult, findJmeterByIds } from "../../datasource/jmeter/jmeter.sql";
import { JmeterEntity } from "../jmeter/jmeter.entity";
import { JmeterResultEntity } from "../jmeter/jmeter_result.entity";
import { exec } from "child_process";
import { CurlService } from "../curl/curl.service";
import { CronJob } from 'cron';
import * as cronParser from 'cron-parser';
import * as fs from 'fs';

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
        private readonly curlService: CurlService,
        private httpService: HttpService,
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
    async getAllJobsService(runStatus: RunStatus, options: IPaginationOptions) {
        let queryBuilder = await findScheduleByStatus(this.scheRepository, runStatus);
        //return await paginate<SchedulerEntity>(queryBuilder, options);
        return queryBuilder;
    }

    /**
     * 删除定时任务
     * @param taskIdsDto
     */
    async deleteJobService(taskIdsDto: TaskIdsDto) {
        Logger.info(`删除定时任务ID：${taskIdsDto.ids}`);
        try {
            for (const id of taskIdsDto.ids) {
                const schObj = await findScheduleById(this.scheRepository, id);
                if (schObj.status == RunStatus.RUNNING) this.schedulerRegistry.deleteCronJob(schObj.md5);
                await deleteSchedulerById(this.scheRepository, id);
            }
        } catch (e) {
            Logger.error(`删除定时任务失败：${e}`)
            throw new HttpException("定时任务删除异常", HttpStatus.BAD_REQUEST);
        }
        return { status: true };

    }

    /**
     * 停止运行中的定时任务
     * @param taskIdsDto
     */
    async stopJobService(taskIdsDto: TaskIdsDto) {
        Logger.info(`停止定时任务ID：${taskIdsDto.ids}`)
        let stopSuccess = [];
        let stopFail = [];
        for (const id of taskIdsDto.ids) {
            const task = await findScheduleById(this.scheRepository, id);
            if (!task) throw new ApiException(`停止的任务id:${id}不存在`, ApiErrorCode.SCHEDULER_MD5_INVAILD, HttpStatus.BAD_REQUEST);
            if (this.isExistTask(task.md5)) {
                try {
                    this.schedulerRegistry.deleteCronJob(task.md5);
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
    delCheckJobTaskService() {
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
    restartSystemCheckJobTaskService() {
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
    async restartTaskService(taskIdsDto: TaskIdsDto) {
        Logger.info(`重启定时任务ID：${taskIdsDto.ids}`)
        const schObjList: SchedulerEntity[] = await findSchedulerOfCaseAndEnvByIds(this.scheRepository, taskIdsDto.ids);
        for (let schedulerEntity of schObjList) {
            if (this.isExistTask(schedulerEntity.md5)) {
                this.schedulerRegistry.deleteCronJob(schedulerEntity.md5);
                this.schedulerRegistry.getCronJob(schedulerEntity.md5).start();
                if (!this.isExistTask(schedulerEntity.md5)) throw new ApiException(`重启定时任务失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                await updateSchedulerRunStatus(this.scheRepository, RunStatus.RUNNING, schedulerEntity.id);
            } else {
                if (schedulerEntity.taskType == TaskType.INTERFACE) {
                    const caseList = await findCaseByCaseGradeAndCatalogs(this.caseRepository, schedulerEntity.caseGrade,
                        schedulerEntity.catalogs.map(catalog => {
                            return catalog.id
                        }));
                    let caseIds = caseList.map(cas => {
                        return cas.id;
                    });
                    await this.runSingleTask(caseIds, schedulerEntity.env.id, schedulerEntity.cron, schedulerEntity.md5);
                } else if (schedulerEntity.taskType == TaskType.JMETER) {
                    const jmeterIds = schedulerEntity.jmeters.map(jmeter => { return jmeter.id });
                    await this.runJmeterTask(jmeterIds, schedulerEntity.cron, schedulerEntity.md5);
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
    async addTaskService(addTaskDto: AddTaskDto) {
        Logger.info(`添加定时任务的数据：${JSON.stringify(addTaskDto)}`);
        const scheduler = new SchedulerEntity();
        scheduler.taskType = addTaskDto.taskType;
        if (addTaskDto.taskType == TaskType.INTERFACE) {
            const caseGrade = addTaskDto.caseGrade == null ? CaseGrade.LOW : addTaskDto.caseGrade;
            const envId = addTaskDto.envId == null ? 5 : addTaskDto.envId;
            let caseList: CaseEntity[] = await findCaseByCaseGradeAndCatalogs(this.caseRepository, caseGrade, addTaskDto.catalogIds);
            if (caseList.length == 0)
                throw new ApiException("需要执行的接口列表为空", ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            let caseIds = caseList.map(cas => {
                return cas.id;
            });
            Logger.info(`运行的定时任务接口ID：${caseIds}`);
            const createDate = new Date();
            const md5 = crypto.createHmac("sha256", createDate + CommonUtil.randomChar(10)).digest("hex");
            const scheObj = await findScheduleByMd5(this.scheRepository, md5);
            if (scheObj) {
                throw new ApiException(`定时任务md5:${md5}已存在,不能重复`, ApiErrorCode.SCHEDULER_MD5_REPEAT, HttpStatus.BAD_REQUEST);
            }
            if (addTaskDto.isSendMessage != null) scheduler.isSendMessage = addTaskDto.isSendMessage;
            scheduler.catalogs = await findCatalogByIds(this.catalogRepository, addTaskDto.catalogIds);
            scheduler.caseGrade = caseGrade;
            scheduler.name = addTaskDto.name;
            scheduler.md5 = md5;
            scheduler.createDate = createDate;
            scheduler.env = await this.envRepository.findOne(envId);
            scheduler.cron = addTaskDto.cron;
            scheduler.status = RunStatus.RUNNING;
            await this.runSingleTask(caseIds, scheduler.env.id, scheduler.cron, scheduler.md5);
        } else if (addTaskDto.taskType == TaskType.JMETER) {
            scheduler.name = addTaskDto.name;
            let jmeterList: JmeterEntity[];
            for (const iterator of addTaskDto.jmeterIds) {
                jmeterList.push(await findJmeterById(this.jmeterRepository, iterator));
            }
            scheduler.jmeters = jmeterList;
            const createDate = new Date();
            const md5 = crypto.createHmac("sha256", createDate + CommonUtil.randomChar(10)).digest("hex");
            const scheObj = await findScheduleByMd5(this.scheRepository, md5);
            if (scheObj) {
                throw new ApiException(`定时任务md5:${md5}已存在,不能重复`, ApiErrorCode.SCHEDULER_MD5_REPEAT, HttpStatus.BAD_REQUEST);
            }
            scheduler.md5 = md5;
            await this.runJmeterTask(addTaskDto.jmeterIds, scheduler.cron, md5);
        } else {
            throw new ApiException(`暂时不支持别的定时任务类型`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        Logger.info(`添加的定时数据: ${JSON.stringify(scheduler)}`)
        const result = await saveScheduler(this.scheRepository, scheduler);
        return { id: result.id };
    }


    /**
     * 更新定时任务
     * @param updateTaskDto
     */
    async updateTaskService(updateTaskDto: UpdateTaskDto) {
        const schObj = await findSchedulerOfCaseAndEnvById(this.scheRepository, updateTaskDto.id);
        if (!schObj) throw new ApiException(`定时任务id ${updateTaskDto.id}找不到`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
        const sObj = new SchedulerEntity();
        // 更新接口类型定时任务数据
        if (schObj.taskType == TaskType.INTERFACE) {
            Logger.info(`更新interface定时任务数据：${JSON.stringify(updateTaskDto)}`);
            if (updateTaskDto.catalogIds != null) sObj.catalogs = await findCatalogByIds(this.catalogRepository, updateTaskDto.catalogIds);
            if (updateTaskDto.isSendMessage != null) sObj.isSendMessage = updateTaskDto.isSendMessage;
            if (updateTaskDto.caseGrade != null) sObj.caseGrade = updateTaskDto.caseGrade;
            if (updateTaskDto.isSendMessage != null) sObj.isSendMessage = updateTaskDto.isSendMessage;
            sObj.name = updateTaskDto.name != null ? updateTaskDto.name : schObj.name;
            sObj.cron = updateTaskDto.cron != null ? updateTaskDto.cron : schObj.cron;
            sObj.env = updateTaskDto.envId != null ? await findEnvById(this.envRepository, updateTaskDto.envId) : schObj.env;
            sObj.status = RunStatus.RUNNING;
            Logger.info(`更新定时任务数据：${JSON.stringify(sObj)}`)
            await updateScheduler(this.scheRepository, sObj, updateTaskDto.id);
        }
        // 更新jmeter类型定时任务数据
        else if (schObj.taskType == TaskType.JMETER) {
            if (updateTaskDto.name != null) sObj.name = updateTaskDto.name;
            if (updateTaskDto.cron != null) sObj.cron = updateTaskDto.cron;
            if (updateTaskDto.jmeterIds.length > 0) sObj.jmeters = await findJmeterByIds(this.jmeterRepository, updateTaskDto.jmeterIds);
            Logger.info(`更新jmeter定时任务数据：${JSON.stringify(sObj)}`);
            await updateScheduler(this.scheRepository, sObj, updateTaskDto.id);
        } else {
            throw new ApiException(`暂时不支持别的定时任务类型`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        if (updateTaskDto.isRestart) {
            const newSecheduler = await findSchedulerOfCaseAndEnvById(this.scheRepository, updateTaskDto.id);
            try {
                // 检测旧的定时任务是否存在，存在删除
                if (this.isExistTask(newSecheduler.md5)) {
                    Logger.info(`存在旧的md5: ${newSecheduler.md5}`)
                    this.schedulerRegistry.deleteCronJob(newSecheduler.md5);
                    if (this.isExistTask(newSecheduler.md5)) {
                        throw new ApiException('定时任务失败', ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                    }
                }
            } catch (e) {
                Logger.error(`更新定时任务失败：${e.stack}`)
                await updateSchedulerRunStatus(this.scheRepository, RunStatus.STOP, updateTaskDto.id);
                throw new ApiException(e, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            }
            // 重启接口类型定时任务
            if (schObj.taskType == TaskType.INTERFACE) {
                try {
                    const catalogIds = newSecheduler.catalogs.map(catalog => {
                        return catalog.id;
                    });
                    let caseList: CaseEntity[] = await findCaseByCaseGradeAndCatalogs(this.caseRepository, newSecheduler.caseGrade, catalogIds);
                    let caseIds = caseList.map(cas => {
                        return cas.id;
                    });
                    await this.runSingleTask(caseIds, newSecheduler.env.id, newSecheduler.cron, newSecheduler.md5);
                    if (!this.isExistTask(newSecheduler.md5)) throw new ApiException(`重启定时任务失败`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                    await updateSchedulerRunStatus(this.scheRepository, RunStatus.RUNNING, updateTaskDto.id);
                } catch (e) {
                    Logger.error(`更新接口定时任务失败：${e.stack}`)
                    await updateSchedulerRunStatus(this.scheRepository, RunStatus.STOP, updateTaskDto.id);
                    throw new ApiException(e, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                }
            }
            // 重启jmeter类型定时任务 
            else if (schObj.taskType == TaskType.JMETER) {
                try {
                    const jmeterIds = newSecheduler.jmeters.map(jmeter => { return jmeter.id });
                    await this.runJmeterTask(jmeterIds, updateTaskDto.cron, newSecheduler.md5);
                } catch (e) {
                    Logger.error(`更新jmeter定时任务失败：${e.stack}`)
                    await updateSchedulerRunStatus(this.scheRepository, RunStatus.STOP, updateTaskDto.id);
                    throw new ApiException(e, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
                }

            } else {
                throw new ApiException(`暂时不支持别的定时任务类型`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            }

            return { status: true };

        }
    }

    /**
     *
     * 检查cron表达式
     * @param cron
     */
    async checkCronService(cron: string) {
        if (cron == null || cron == "") {
            throw new ApiException(`cron不能为空`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
        }
        try {
            cronParser.parseExpression(cron);
            return { result: true };
        } catch (e) {
            return { result: false };
        }
    }

    /**
     * 运行单接口任务
     * @param caseIds
     * @param envId
     * @param cron
     * @param md5
     */
    private async runSingleTask(caseIds: number[], envId: number, cron: string, md5: string) {

        const caseListDto = new RunCaseListDto(caseIds, envId, Executor.SCHEDULER);
        const job = new CronJob(cron, async () => {
            let result = await this.runService.runCaseById(caseListDto);
            const taskResult = new TaskResultEntity();
            taskResult.result = JSON.stringify(result);
            taskResult.scheduler = await findScheduleByMd5(this.scheRepository, md5);

            if (!taskResult.scheduler) throw new ApiException(`定时任务md5:${md5}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            const saveResult: TaskResultEntity = await saveTaskResult(this.taskResultRepository, taskResult);
            if (taskResult.scheduler.isSendMessage) {
                const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
                this.curlService.sendDingTalkMessage(`${taskResult.scheduler.name}：` + config.taskResultUrl + saveResult.id);
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
    private async runJmeterTask(jmeterIds: number[], cron: string, md5: string) {
        const job = new CronJob(cron, async () => {
            for (const iterator of jmeterIds) {
                const jmeterBinPath = this.config.jmeterBinPath;
                const jmeterJtlPath = this.config.jmeterJtlPath;
                const jmeterLogPath = this.config.jmeterLogPath;

                const jmeter = await findJmeterById(this.jmeterRepository, iterator);
                const jmeterCountNum = jmeter.preCountNumber;
                const preCountTime = jmeter.preCountTime;
                const loopNum = jmeter.loopNum;
                const remote_address = jmeter.remote_address == null || jmeter.remote_address == '' ? '' : '-R ' + jmeter.remote_address;


                //创建临时文件
                const md5 = crypto.createHmac("sha256", new Date() + CommonUtil.randomChar(10)).digest("hex");
                const tmpJmxtFilePath = '/tmp/' + md5 + '.jmx';
                const tmpJtlFilePath = jmeterJtlPath + '/' + md5 + '.jtl';
                const tmpLogFilePath = jmeterLogPath + '/' + md5 + '.log';
                //下载文件
                const ds = await this.httpService.get(jmeter.url).toPromise();
                fs.writeFileSync(tmpJmxtFilePath, ds.data);

                //构建命令行
                const cmd = `${jmeterBinPath} -n -t ${tmpJmxtFilePath} -Jconcurrent_number=${jmeterCountNum} -Jduration=${preCountTime} -Jcycles=${loopNum} -j ${tmpLogFilePath} -l ${tmpJtlFilePath} ${remote_address}`;
                Logger.info(`压测脚本命令行：${cmd}`)
                //执行命令行
                const child = exec(cmd, { killSignal: "SIGINT" }, async (error, stdout, stderr) => {
                    if (error) {
                        Logger.error(error.stack);
                    }
                });
                //监听返回记录
                child.stdout.on("data", (data) => {
                    Logger.info(data);
                });
                //监听结束
                child.stdout.on("close", async () => {
                    if (!fs.existsSync(jmeterJtlPath + `/${md5}.jtl`)) {
                        const jmeterResult = new JmeterResultEntity();
                        jmeterResult.jmeter = jmeter;
                        jmeterResult.md5 = md5;
                        jmeterResult.jmeterRunStatus = JmeterRunStatus.FAIL;
                        await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
                    }
                    else {
                        const jmeterResult = new JmeterResultEntity();
                        jmeterResult.jmeter = jmeter;
                        jmeterResult.md5 = md5;
                        jmeterResult.jmeterRunStatus = JmeterRunStatus.FINISH;
                        await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
                        //copy运行结果到远程服务器
                        //const copyJtl = `scp -r ${tmpJtlFilePath}  ${jmeterJtlPath}`;
                        //execSync(copyJtl);
                        //删除本地的数据
                        //fs.unlinkSync(tmpJtlFilePath);
                    }
                    //copy压测信息到远程服务器
                    //const copyLog = `scp -r ${tmpLogFilePath}  ${jmeterLogPath}`;
                    //execSync(copyLog);
                    //删除临时生成的压测文件
                    fs.unlinkSync(tmpJmxtFilePath);
                    //fs.unlinkSync(tmpLogFilePath);
                    Logger.info(`jmeter脚本：${jmeter.name} -- 执行完毕`);
                });

            }
        }
        );
        this.schedulerRegistry.addCronJob(md5, job);
        job.start();
    }



    /**
     * 
     * @param md5 
     */
    private isExistTask(md5: string) {
        try {
            this.schedulerRegistry.getCronJob(md5);
            return true;
        } catch (e) {
            return false;
        }
    }


    /**
     * 查询定时任务结果
     * @param schedulerId 
     * @param options 
     */
    async getAllTaskResultService(schedulerId: number, options: IPaginationOptions) {
        let queryBuilder = await findAllTaskResult(this.taskResultRepository, schedulerId);
        const data = await paginate<TaskResultEntity>(queryBuilder, options);
        for (let item of data.items) {
            item.result = JSON.parse(item.result);
        }
        return data;
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

    async restartTask() {
        const ids: number[] = (await findScheduleRuningIds(this.scheRepository)).map(sch => { return sch.id });
        if (ids.length == 0) {
            return;
        }
        const taskIds = new TaskIdsDto();
        taskIds.ids = ids;
        await this.restartTaskService(taskIds);
        const jobs = this.schedulerRegistry.getCronJobs();
        const keys = jobs.keys();
        for (let iterator of keys) {
            Logger.info(`重新启动的定时任务key：${iterator}`);
        }
    }


}
