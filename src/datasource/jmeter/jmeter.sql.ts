import {Repository, Brackets} from "typeorm";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";
import {JmeterEntity} from "../../api/jmeter/jmeter.entity";
import { JmeterResultEntity } from "../../api/jmeter/jmeter_result.entity";

/**
 * 创建jmeter
 * @param jmeterEntityRepository
 * @param jmeterObj
 */
export const createJmeter = async (jmeterEntityRepository: Repository<JmeterEntity>, jmeterObj: any) => {
    return await jmeterEntityRepository.save(jmeterObj).catch(
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
export const findJmeterById = async (jmeterEntityRepository: Repository<JmeterEntity>, id: number) => {
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
export const findJmeterByIds = async (jmeterEntityRepository: Repository<JmeterEntity>, ids: any) => {
    return await jmeterEntityRepository.createQueryBuilder('jmeter').
    where('jmeter.id IN (:...ids)',{ids: ids}).
    andWhere('jmeter.isRealDelete = :isRealDelete', {isRealDelete: false}).
    getMany().
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
export const updateJmeterById = async (jmeterEntityRepository: Repository<JmeterEntity>, jmeterObj, id: number) => {
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
export const deleteJmeterByIds = async (jmeterEntityRepository: Repository<JmeterEntity>, ids: any) => {
    return await jmeterEntityRepository.createQueryBuilder('jmeter').update().set({
        isRealDelete: true
    }).where('jmeter.id IN (:...ids)',{ids: ids}).execute().catch(
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
export const saveJmeterResult = async (jmeterResultEntityRepository: Repository<JmeterResultEntity>, jmeterResultObj: any) => {
    return await jmeterResultEntityRepository.save(jmeterResultObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 查询jmeter脚本列表
 * @param jmeterResultEntityRepository 
 * @param name 
 */
export const findJmeterList = (jmeterEntityRepository: Repository<JmeterEntity>, name: string) => {
    return jmeterEntityRepository.createQueryBuilder('jmeter').
    where(
        qb => {
            if (name) {
                qb.where('jmeter.isRealDelete = :isRealDelete',{isRealDelete: false});
                qb.andWhere("jmeter.name LIKE :param",{param: '%' + name + '%'});
            }else {
                qb.where('jmeter.isRealDelete = :isRealDelete',{isRealDelete: false});
            }
        }
    ).orderBy('jmeter.updateDate','DESC');
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

/**
 * 通过jmeterid查询结果
 * @param jmeterResultEntityRepository 
 * @param jmeterId 
 */
export const findJmeterResultListById = (jmeterResultEntityRepository: Repository<JmeterResultEntity>, jmeterId) => {
    return jmeterResultEntityRepository.createQueryBuilder('jmeterResult').where('jmeterResult.jmeter = :jmeter',{jmeter: jmeterId})
    .orderBy('jmeterResult.createDate','DESC');
};