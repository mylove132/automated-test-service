import {Repository} from "typeorm";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";
import {HistoryEntity} from "../../api/history/history.entity";

/**
 * 保存历史记录
 * @param historyRepository
 * @param historyObj
 */
export const saveHistory = async (historyRepository: Repository<HistoryEntity>, historyObj: any) => {
    return await historyRepository.save(historyObj)
        .catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
};


/**
 * 查询历史记录
 * @param historyRepository
 * @param path
 */
export const findHistoryByPath = async (historyRepository: Repository<HistoryEntity>, path: string) => {
    return historyRepository.createQueryBuilder('history').leftJoinAndSelect('history.case', 'case').where(
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
