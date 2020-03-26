import {Repository} from "typeorm";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";
import {EndpointEntity} from "../../api/env/endpoint.entity";
import {EnvEntity} from "../../api/env/env.entity";

/**
 * 通过endpoint ID查询
 * @param endpointEntityRepository
 * @param id
 */
export const findEndpointById = async (endpointEntityRepository: Repository<EndpointEntity>, id) => {
    return await endpointEntityRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
}

/**
 * 通过环境ID查询实体
 * @param entityRepository
 * @param id
 */
export const findEnvById = async (entityRepository: Repository<EnvEntity>, id) => {
    return await entityRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 获取所有的环境
 * @param entityRepository
 */
export const findAllEnv = async (entityRepository: Repository<EnvEntity>) => {
    return await entityRepository.createQueryBuilder().
    getMany().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 更新环境
 * @param entityRepository
 * @param envObj
 * @param envId
 */
export const updateEnv = async (entityRepository: Repository<EnvEntity>, envObj, envId) => {
    return await entityRepository.createQueryBuilder().
    update(EnvEntity).
    set(envObj).
    where('id = :id',{id: envId}).
    execute().
    catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 添加环境
 * @param entityRepository
 * @param envObj
 */
export const addEnv = async (entityRepository: Repository<EnvEntity>, envObj) => {
    return await entityRepository.createQueryBuilder().
    insert().
    into(EnvEntity).
    values(envObj).
    execute().
        catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 删除环境
 * @param entityRepository
 * @param envObj
 */
export const deleteEnvByIds = async (entityRepository: Repository<EnvEntity>, envIds) => {
    return await entityRepository.createQueryBuilder().
    delete().
    where('id IN (:...ids)',{ids: envIds}).
    execute().
    catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};



/**
 * 删除环境
 * @param endpointRepository
 * @param endpointIds
 */
export const deleteEndpointByIds = async (endpointRepository: Repository<EndpointEntity>, endpointIds) => {
    return await endpointRepository.createQueryBuilder().
    delete().
    where('id IN (:...ids)',{ids: endpointIds}).
    execute().
    catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};
