import {Repository} from "typeorm";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";
import {HistoryEntity} from "../../api/history/history.entity";

/**
 * 保存历史记录
 * @param historyReposity
 * @param historyObj
 */
export const saveHistory = async (historyReposity: Repository<HistoryEntity>, historyObj) => {
    return await historyReposity.save(historyObj)
        .catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
};


/**
 * 查询历史记录
 * @param historyReposity
 * @param path
 */
export const findHistoryByPath = async (historyReposity: Repository<HistoryEntity>, path) => {
    return await historyReposity.createQueryBuilder('history').
    leftJoinAndSelect('history.case', 'case').
    where(
        qb => {
            if (path) {
                qb.where("case.path LIKE :param")
                    .setParameters({
                        param: '%' + path + '%'
                    })
            }
        }
    ).orderBy('history.createDate', 'DESC');
};
