/**
 * 通过环境ID查询实体
 * @param entityRepository
 * @param id
 */
import {TokenEntity} from "../../api/token/token.entity";
import {Repository} from "typeorm";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";


/**
 * 通过token ID查找实体
 * @param tokenEntityRepository
 * @param id
 */
export const findTokenById = async (tokenEntityRepository: Repository<TokenEntity>, id) => {
    return await tokenEntityRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 通过token URL和用户名查找实体
 * @param tokenEntityRepository
 * @param url
 * @param username
 */
export const findTokenByUrlAndUsername = async (tokenEntityRepository: Repository<TokenEntity>, url, username) => {
    return await tokenEntityRepository.createQueryBuilder('token').
    where('token.url = :url',{url: url}).
    andWhere('token.username = :username',{username: username}).
    getOne().
    catch(
        err => {
            throw new ApiException(err, ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
        }
    );
};

/**
 * 查询所有的token数据
 * @param tokenEntityRepository
 */
export const findAllToken = async (tokenEntityRepository: Repository<TokenEntity>) => {
    return await tokenEntityRepository.createQueryBuilder('token').
    leftJoinAndSelect('token.platformCode','platform').
    leftJoinAndSelect('token.env','env').
    getMany().
    catch(
        err => {
            throw new ApiException(err, ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
        }
    );
};


/**
 * 查询所有的token platform
 * @param tokenEntityRepository
 */
export const findAllTokenPlatform = async (tokenEntityRepository: Repository<TokenEntity>) => {
    return  await tokenEntityRepository.createQueryBuilder('token').
    leftJoinAndSelect('token.platformCode','platform').
    getMany().
    catch(
        err => {
            throw new ApiException(err, ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
        }
    );
};


/**
 * 查询所有的token env
 * @param tokenEntityRepository
 * @param platformCodeId
 */
export const findAllTokenEnvByPlatformCodeId = async (tokenEntityRepository: Repository<TokenEntity>, platformCodeId) => {
    return  await tokenEntityRepository.createQueryBuilder('token').
    leftJoinAndSelect('token.env','env').
    where('token.platformCode = :platformCode',{platformCode: platformCodeId}).
    getMany().
    catch(
        err => {
            throw new ApiException(err, ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
        }
    );
};


/**
 * 查询所有的token 通过envId和platformCodeId
 * @param tokenEntityRepository
 * @param platformCodeId
 * @param envId
 */
export const findAllTokenByPlatformCodeIdAndEnvId = async (tokenEntityRepository: Repository<TokenEntity>, platformCodeId, envId) => {
    return  await tokenEntityRepository.createQueryBuilder('token').
    where('token.platformCode = :platformCode',{platformCode: platformCodeId}).
    andWhere('token.env = :env',{env: envId}).
    getMany().
    catch(
        err => {
            throw new ApiException(err, ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
        }
    );
};

/**
 * 通过token URL和用户名查找实体
 * @param tokenEntityRepository
 * @param url
 * @param username
 */
export const findTokenByEnvIdAndPlatformCode = async (tokenEntityRepository: Repository<TokenEntity>, envId, platformCodeId) => {
    return await tokenEntityRepository.createQueryBuilder('token').
        leftJoinAndSelect('token.env','env').
        leftJoinAndSelect('token.platformCode','platform').
        where(qb => {
            if (envId) {
                qb.where('token.env = :env',{env:envId});
                if (platformCodeId){
                    qb.andWhere('token.platformCode = :platformCode',{platformCode: platformCodeId});
                }
            }else {
                if (platformCodeId){
                    qb.where('token.platformCode = :platformCode',{platformCode: platformCodeId});
                }
            }
    }).orderBy('token.updateDate', 'DESC');
};


/**
 * 查询token集合
 * @param tokenEntityRepository
 */
export const findTokens = async (tokenEntityRepository: Repository<TokenEntity>) => {
    return await tokenEntityRepository.createQueryBuilder('token').
    leftJoinAndSelect('token.platformCode','platform').
    orderBy('token.updateDate', 'DESC').getMany();
};


/**
 * 保存实体
 * @param tokenEntityRepository
 * @param tokenObj
 */
export const saveToken = async (tokenEntityRepository: Repository<TokenEntity>, tokenObj) => {
    return await tokenEntityRepository.save(tokenObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 删除token
 * @param tokenEntityRepository
 * @param ids
 */
export const deleteTokenByIds = async (tokenEntityRepository: Repository<TokenEntity>, ids) => {
    return await tokenEntityRepository.createQueryBuilder('token').
    delete().
    where('id IN (:...ids)',{ids: ids}).
    execute().
    catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 更新token
 * @param tokenEntityRepository
 * @param tokenObj
 * @param id
 */
export const updateToken = async (tokenEntityRepository: Repository<TokenEntity>, tokenObj, id) => {
    return await tokenEntityRepository.createQueryBuilder('token').
    update(TokenEntity).
    set(tokenObj).
    where('id = :id',{id: id}).
    execute().
    catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


export const updateTokenByNewToken = async (tokenEntityRepository: Repository<TokenEntity>, newToken, id) => {
    return await tokenEntityRepository.createQueryBuilder().
    update(TokenEntity).
    set(
        {token: newToken}
    ).
    where('id = :id',{id: id}).
    execute().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    );
};

