import {Repository} from "typeorm";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";
import {JmeterEntity} from "../../api/jmeter/jmeter.entity";
import { JmeterResultEntity } from "src/api/jmeter/jmeter_result.entity";

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
 * @param ids
 */
export const findJmeterByIds = async (jmeterEntityRepository: Repository<JmeterEntity>, ids) => {
    return await jmeterEntityRepository.createQueryBuilder().
    where('id IN (:...ids)',{ids: ids}).getMany().
    catch(
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
 * 更新jmeter的md5值
 * @param jmeterEntityRepository 
 * @param md5 
 * @param id 
 */
export const updateJmeterMd5ById = async (jmeterEntityRepository: Repository<JmeterEntity>, md5, id) => {
    return await jmeterEntityRepository.update(id, {md5: md5}).catch(
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

/**
 * 保存jmeter结果
 * @param jmeterResultEntityRepository 
 * @param jmeterResultObj 
 */
export const saveJmeterResult = async (jmeterResultEntityRepository: Repository<JmeterResultEntity>, jmeterResultObj) => {
    return await jmeterResultEntityRepository.save(jmeterResultObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 查询执行结果列表，模糊匹配压测脚本
 * @param jmeterResultEntityRepository 
 * @param name 
 */
export const findJmeterResultList = (jmeterResultEntityRepository: Repository<JmeterResultEntity>, name: string) => {
    return jmeterResultEntityRepository.createQueryBuilder('jmeterResult').
    leftJoinAndSelect('jmeterResult.jmeter','jmeter').
    where(
        qb => {
            if (name) {
                qb.where("jmeter.name LIKE :param")
                    .setParameters({
                        param: '%' + name + '%'
                    })
            }
        }
    ).orderBy('jmeterResult.createDate','DESC');
};