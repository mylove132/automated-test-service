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

export const findTokenById = async (tokenEntityRepository: Repository<TokenEntity>, id) => {
    return await tokenEntityRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
}
