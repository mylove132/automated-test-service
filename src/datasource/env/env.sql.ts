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
 * 根据endpoint值查询endpoint实体
 * @param endpointEntity
 * @param endpoint
 */
export const findEndpointInstanceByEndpoint = async (endpointEntity: Repository<EndpointEntity>, endpoint) => {
    return await endpointEntity.createQueryBuilder('endpoint').
    where('endpoint.endpoint = :enp', {enp: endpoint}).
    getOne().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 保存endpoint实体
 * @param endpointEntity
 * @param endpointObj
 */
export const saveEndpoint = async (endpointEntity: Repository<EndpointEntity>, endpointObj) => {
    return await endpointEntity.save(endpointObj)
    .catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 通过环境ID查询endpoint值
 * @param envRepositoryEntity
 * @param envIds
 */
export const findEndpointByEnvIds = async (envRepositoryEntity: Repository<EnvEntity>, envIds) => {
    return await envRepositoryEntity.createQueryBuilder("env").
    leftJoinAndSelect('env.endpoints','envpoint').
    where('env.id IN (:...envIds)',{envIds: envIds}).
    getMany().
    catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.BAD_REQUEST);
            }
        );
};



/**
 * 通过环境ID查询endpoint值
 * @param envRepositoryEntity
 */
export const findEndpoints = async (envRepositoryEntity: Repository<EnvEntity>) => {
    return await envRepositoryEntity.createQueryBuilder("env").
    leftJoinAndSelect('env.endpoints','envpoint').
    getMany().
    catch(
        err => {
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.BAD_REQUEST);
        }
    );
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
