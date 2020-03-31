import { PlatformCodeEntity } from "src/api/catalog/platformCode.entity";
import { Repository } from "typeorm";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { HttpStatus } from "@nestjs/common";

/**
 * 通过code查询platform实体
 * @param PlatformCodeEntity
 * @param platformCode
 */
export const findPlatformCodeByCode = async (PlatformCodeEntity: Repository<PlatformCodeEntity>, platformCode) => {
    return await PlatformCodeEntity.createQueryBuilder('platform').
    where('platform.platformCode = :platformCode',{platformCode: platformCode}).
    getOne().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 通过id查询platform实体
 * @param PlatformCodeEntity
 * @param id
 */
export const findPlatformCodeById = async (PlatformCodeEntity: Repository<PlatformCodeEntity>, id) => {
    return await PlatformCodeEntity.createQueryBuilder('platform').
    where('platform.id = :id',{id: id}).
    getOne().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 通过code集合查询platform实体
 * @param PlatformCodeEntity
 * @param platformCodeList
 */
export const findPlatformCodeByCodeList = async (PlatformCodeEntity: Repository<PlatformCodeEntity>, platformCodeList) => {
    return await PlatformCodeEntity.createQueryBuilder('platform').
    where('platform.platformCode IN (:...platformCode)',{platformCode: platformCodeList}).
    getMany().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 通过code集合查询platform实体
 * @param PlatformCodeEntity
 */
export const findAllPlatformCode= async (PlatformCodeEntity: Repository<PlatformCodeEntity>) => {
    return await PlatformCodeEntity.createQueryBuilder('platform').
    getMany().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};
