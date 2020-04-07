import { Repository } from "typeorm";
import { SchedulerEntity } from "src/api/task/scheduler.entity";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { HttpStatus } from "@nestjs/common";
import { RunStatus } from "../../config/base.enum";

/**
 * 通过ID查询定时任务
 * @param schedulerReposity
 * @param id
 */
export const findSchedulerOfCaseAndEnvById = async (schedulerReposity: Repository<SchedulerEntity>, id) => {
  return await schedulerReposity.createQueryBuilder("sch").
  leftJoinAndSelect("sch.cases", "cases").
  leftJoinAndSelect("sch.env", "env").
  where("sch.id = :id", { id: id }).
  getOne().
  catch(
    err => {
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};


/**
 * 保存定时任务
 * @param schedulerReposity
 * @param schedulerObj
 */
export const saveScheduler = async (schedulerReposity: Repository<SchedulerEntity>, schedulerObj) => {
  return await schedulerReposity.save(schedulerObj).catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};


/**
 * 更新定时任务
 * @param schedulerReposity
 * @param schedulerObj
 * @param id
 */
export const updateScheduler = async (schedulerReposity: Repository<SchedulerEntity>, schedulerObj, id) => {
  return await schedulerReposity.update(id, schedulerObj).catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};

/**
 * 更新定时任务运行状态
 * @param schedulerReposity
 * @param runstatus
 * @param id
 */
export const updateSchedulerRunStatus = async (schedulerReposity: Repository<SchedulerEntity>, runstatus: RunStatus, id) => {
  return await schedulerReposity.createQueryBuilder().
  update().
  set({status: runstatus}).
  where('id = :id', {id: id}).
  execute().catch(
    err => {
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};

