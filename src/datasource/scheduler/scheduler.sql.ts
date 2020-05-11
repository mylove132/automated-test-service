import { Repository } from "typeorm";
import { SchedulerEntity } from "src/api/task/scheduler.entity";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { HttpStatus } from "@nestjs/common";
import { RunStatus } from "../../config/base.enum";
import { TaskResultEntity } from "../../api/task/task_result.entity";

/**
 * 通过ID查询定时任务
 * @param schedulerRepository
 * @param id
 */
export const findSchedulerOfCaseAndEnvById = async (schedulerRepository: Repository<SchedulerEntity>, id) => {
  return await schedulerRepository.createQueryBuilder("sch").
  leftJoinAndSelect("sch.env", "env").
  leftJoinAndSelect("sch.catalogs", "catalogs").
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
export const findSchedulerOfCaseAndEnvByIds = async (schedulerRepository: Repository<SchedulerEntity>, ids: any) => {
    return await schedulerRepository.createQueryBuilder("sch").
    leftJoinAndSelect("sch.env", "env").
    leftJoinAndSelect("sch.catalogs", "catalogs").
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
    return schedulerRepository.createQueryBuilder("sch").
    leftJoinAndSelect('sch.env','env').
    leftJoinAndSelect('sch.catalogs','catalogs').
    where(qb => {
        if (runStatus != null) {
            qb.where("sch.status = :status", {status: runStatus});
        }
    }).orderBy("sch.updateDate", "DESC");
};


export const findScheduleListByStatus = async (schedulerRepository: Repository<SchedulerEntity>, runStatus: RunStatus) => {
  return schedulerRepository.createQueryBuilder("sch").
  leftJoinAndSelect('sch.env','env').
  where(qb => {
    if (runStatus != null) {
      qb.where("sch.status = :status", {status: runStatus});
    }
  }).getMany().catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  )
};



/**
 * 通过ID查询
 * @param schedulerRepository
 * @param id
 */
export const findScheduleById = async (schedulerRepository: Repository<SchedulerEntity>, id: number) => {
    return await schedulerRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 通过md5查询
 * @param schedulerRepository
 * @param md5
 */
export const findScheduleByMd5 = async (schedulerRepository: Repository<SchedulerEntity>, md5) => {
  return await schedulerRepository.findOne({md5: md5}).catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  )
};

/**
 * 查询所有运行中的定时任务ID
 * @param schedulerRepository 
 */
export const findScheduleRuningIds = async (schedulerRepository: Repository<SchedulerEntity>) => {
  return await schedulerRepository.createQueryBuilder().
  where('status = :status',{status: RunStatus.RUNNING}).
  getMany().catch(
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

/**
 * 通过ID删除
 * @param schedulerRepository
 * @param runStatus
 * @param id
 */
export const deleteSchedulerById = async (schedulerRepository: Repository<SchedulerEntity>, id: number) => {
    return await schedulerRepository.update(id,{status: RunStatus.DELETE}).catch(
        err => {
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 保存定时任务执行结果
 * @param taskResultRepository
 * @param taskResultObj
 */
export const saveTaskResult = async (taskResultRepository: Repository<TaskResultEntity>, taskResultObj: TaskResultEntity) => {
  return await taskResultRepository.save(taskResultObj).catch(
    err => {
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};

/**
 * 查询所有的定时任务执行记录
 * @param taskResultRepository
 */
export const findAllTaskResult = async (taskResultRepository: Repository<TaskResultEntity>, schedulerId: number) => {
    return taskResultRepository.createQueryBuilder('taskResult').
    leftJoinAndSelect('taskResult.scheduler','scheduler').
    where(
      qb => {
        if (schedulerId) {
          qb.where('scheduler.id = :schedulerId',{schedulerId: schedulerId});
        }
      }
    ).
    orderBy("taskResult.createDate", "DESC");
};

/**
 * 通过ID查询定时任务执行结果
 * @param taskResultRepository
 * @param id
 */
export const findTaskResultById = async (taskResultRepository: Repository<TaskResultEntity>, id) => {
    return await taskResultRepository.findOne(id).catch(
        err => {
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};
