import { Repository } from "typeorm";
import { SchedulerEntity } from "src/api/task/scheduler.entity";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { HttpStatus } from "@nestjs/common";
import { RunStatus } from "../../config/base.enum";

/**
 * 通过ID查询定时任务
 * @param schedulerRepository
 * @param id
 */
export const findSchedulerOfCaseAndEnvById = async (schedulerRepository: Repository<SchedulerEntity>, id) => {
  return await schedulerRepository.createQueryBuilder("sch").
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
 * 查询定时任务通过ID集合
 * @param schedulerRepository
 * @param ids
 */
export const findSchedulerOfCaseAndEnvByIds = async (schedulerRepository: Repository<SchedulerEntity>, ids) => {
    return await schedulerRepository.createQueryBuilder("sch").
    leftJoinAndSelect("sch.cases", "cases").
    leftJoinAndSelect("sch.env", "env").
    where("sch.id IN (:...ids)", { ids: ids }).
    getMany().
    catch(
        err => {
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    );
};

/**
 * 根据状态查询定时任务
 * @param schedulerRepository
 * @param runStatus
 */
export const findScheduleByStatus = async (schedulerRepository: Repository<SchedulerEntity>, runStatus: RunStatus) => {
    return schedulerRepository.createQueryBuilder("sch").where(qb => {
        if (runStatus != null) {
            qb.where("sch.status = :status", {status: runStatus});
        }
    }).orderBy("sch.updateDate", "DESC");
};



/**
 * 通过ID查询
 * @param schedulerRepository
 * @param id
 */
export const findScheduleById = async (schedulerRepository: Repository<SchedulerEntity>, id) => {
    return await schedulerRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 保存定时任务
 * @param schedulerRepository
 * @param schedulerObj
 */
export const saveScheduler = async (schedulerRepository: Repository<SchedulerEntity>, schedulerObj) => {
  return await schedulerRepository.save(schedulerObj).catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};


/**
 * 更新定时任务
 * @param schedulerRepository
 * @param schedulerObj
 * @param id
 */
export const updateScheduler = async (schedulerRepository: Repository<SchedulerEntity>, schedulerObj, id) => {
  return await schedulerRepository.update(id, schedulerObj).catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};

/**
 * 更新定时任务运行状态
 * @param schedulerRepository
 * @param runStatus
 * @param id
 */
export const updateSchedulerRunStatus = async (schedulerRepository: Repository<SchedulerEntity>, runStatus: RunStatus, id) => {
  return await schedulerRepository.createQueryBuilder().
  update().
  set({status: runStatus}).
  where('id = :id', {id: id}).
  execute().catch(
    err => {
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};

