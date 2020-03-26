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
}
