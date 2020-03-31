import {Repository} from "typeorm";
import {OperateEntity} from "../../api/operate/operate.entity";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";
import {ExceptionEntity} from "../../api/operate/expection.entity";


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
    )
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
    )
}
