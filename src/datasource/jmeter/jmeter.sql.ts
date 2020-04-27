import {Repository} from "typeorm";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";
import {JmeterEntity} from "../../api/jmeter/jmeter.entity";

/**
 * 创建jmeter
 * @param jmeterEntityRepository
 * @param jmeterObj
 */
export const createJmeter = async (jmeterEntityRepository: Repository<JmeterEntity>, jmeterObj) => {
    return await jmeterEntityRepository.save(jmeterObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 通过md5值查找jmeter
 * @param jmeterEntityRepository
 * @param md5
 */
export const findJmeterByMd5 = async (jmeterEntityRepository: Repository<JmeterEntity>, md5) => {
    return await jmeterEntityRepository.findOne({md5: md5}).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 通过id查找jmeter
 * @param jmeterEntityRepository
 * @param id
 */
export const findJmeterById = async (jmeterEntityRepository: Repository<JmeterEntity>, id) => {
    return await jmeterEntityRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 通过id查找jmeter
 * @param jmeterEntityRepository
 * @param id
 */
export const findJmeterOfMd5s = async (jmeterEntityRepository: Repository<JmeterEntity>, id) => {
    return await jmeterEntityRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 通过ID更新jmeter
 * @param jmeterEntityRepository
 * @param jmeterObj
 * @param id
 */
export const updateJmeterById = async (jmeterEntityRepository: Repository<JmeterEntity>, jmeterObj, id) => {
    return await jmeterEntityRepository.update(id, jmeterObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 通过ID集合删除jmeter信息
 * @param jmeterEntityRepository
 * @param ids
 */
export const deleteJmeterByIds = async (jmeterEntityRepository: Repository<JmeterEntity>, ids) => {
    return await jmeterEntityRepository.delete(ids).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};
