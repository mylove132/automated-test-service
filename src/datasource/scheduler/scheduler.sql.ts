import { Repository } from "typeorm"
import { SchedulerEntity } from "src/api/task/scheduler.entity"
import {RunStatus} from "../../config/base.enum";

export const findAllScheduler = async (schedulerReposity: Repository<SchedulerEntity>, runStatus: RunStatus) => {
    const queryBuilder = await schedulerReposity.createQueryBuilder('scheduler').where(qb =>{
        if (runStatus) qb.where('scheduler.status = :status', {status: runStatus})
    });
};
