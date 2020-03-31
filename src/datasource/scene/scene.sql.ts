import {Repository} from "typeorm";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";
import {SceneEntity} from "../../api/scene/scene.entity";

/**
 * 保存实体
 * @param sceneRepository
 * @param sceneObj
 */
export const saveScene = async (sceneRepository: Repository<SceneEntity>, sceneObj) => {
    return await sceneRepository.save(sceneObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 更新实体
 * @param sceneRepository
 * @param sceneObj
 */
export const updateScene = async (sceneRepository: Repository<SceneEntity>, id, sceneObj) => {
    return await sceneRepository.update(id, sceneObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    );
};


/* 删除实体
* @param sceneRepository
* @param sceneObj
*/
export const deleteScene = async (sceneRepository: Repository<SceneEntity>, ids) => {
    return await sceneRepository.delete(ids).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    );
};

/* 删除实体
* @param sceneRepository
* @param sceneObj
*/
export const findScene = async (sceneRepository: Repository<SceneEntity>, catalogId, sceneGradeList) => {
    return  await sceneRepository.createQueryBuilder("scene")
        .where(qb => {
            if (catalogId){
                qb.where('scene.catalog = :catalogId',{catalogId: catalogId}).
                andWhere('scene.sceneGrade IN (:...sceneGrade)',{sceneGrade: sceneGradeList})
            }else {
                qb.where('scene.sceneGrade IN (:...sceneGrade)',{sceneGrade: sceneGradeList})
            }
        }).orderBy('scene.createDate','DESC');
};

