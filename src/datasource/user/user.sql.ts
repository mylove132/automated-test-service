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
import {UserEntity} from "../../api/user/user.entity";


/**
 * 查询所有用户
 * @param userEntityRepository
 */
export const findUserList = async (userEntityRepository: Repository<UserEntity>) => {
    return await userEntityRepository.find().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};
