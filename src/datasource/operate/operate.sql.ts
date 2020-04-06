import { Repository } from "typeorm";
import { OperateEntity } from "../../api/operate/operate.entity";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { HttpStatus } from "@nestjs/common";
import { ExceptionEntity } from "../../api/operate/expection.entity";
import { OperateModule, OperateType } from "../../api/operate/dto/operate.dto";


/**
 * 保存操作记录
 * @param operateReposity
 * @param oe
 */
export const saveOperate = async (operateReposity: Repository<OperateEntity>, oe: OperateEntity) => {
  await operateReposity.save(oe).catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};


/**
 * 保存异常记录
 * @param exceptionReposity
 * @param ee
 */
export const saveException = async (exceptionReposity: Repository<ExceptionEntity>, ee: ExceptionEntity) => {
  await exceptionReposity.save(ee).catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};

/**
 * 查询操作记录
 * @param operateEntityRepository
 * @param userId
 * @param operateModule
 * @param operateType
 */
export const findOperateByUserAndOperate = async (operateEntityRepository: Repository<OperateEntity>,
                                                  userId, operateModule: OperateModule, operateType: OperateType) => {
  return await operateEntityRepository.createQueryBuilder("operate").where(qb => {
    if (userId) {
      qb.where("operate.user = :user", { user: userId });
      if (operateModule) {
        qb.andWhere("operate.operateModule = :operateModule", { operateModule: operateModule });
      }
      if (operateType) {
        qb.andWhere("operate.operateType = :operateType", { operateType: operateType });
      }
    } else {
      if (operateModule) {
        qb.where("operate.operateModule = :operateModule", { operateModule: operateModule });
        if (operateType) {
          qb.andWhere("operate.operateType = :operateType", { operateType: operateType });
        }
      } else {
        if (operateType) {
          qb.where("operate.operateType = :operateType", { operateType: operateType });
        }
      }
    }
  }).leftJoinAndSelect('operate.user','user').
  orderBy('operate.createDate','DESC');
};
