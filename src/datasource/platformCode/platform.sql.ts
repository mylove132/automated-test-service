import { PlatformCodeEntity } from "src/api/catalog/platformCode.entity";
import { Repository } from "typeorm";
import { ApiException } from "src/shared/exceptions/api.exception";
import { ApiErrorCode } from "src/shared/enums/api.error.code";
import { HttpStatus } from "@nestjs/common";

/**
 * 通过code查询platform实体
 * @param entityRepository
 * @param id
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
 * 通过code集合查询platform实体
 * @param entityRepository
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
