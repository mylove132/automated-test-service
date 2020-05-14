import { Repository } from "typeorm";
import { DynDbEntity } from "../../api/dyndata/dyndb.entity";
import { DynSqlEntity } from "../../api/dyndata/dynsql.entity";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { HttpStatus } from "@nestjs/common";

/**
 * 保存数据库配置
 * @param dynDbEntityRepository
 * @param dbObj
 */
export const saveDb = async (dynDbEntityRepository: Repository<DynDbEntity>, dbObj: DynDbEntity) => {
    return dynDbEntityRepository.save(dbObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 *  保存sql语句
 * @param dynSqlEntityRepository
 * @param sqlObj
 */
export const saveSql = async (dynSqlEntityRepository: Repository<DynSqlEntity>, sqlObj: DynSqlEntity) => {
    return dynSqlEntityRepository.save(sqlObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 更新数据库配置
 * @param dynSqlEntityRepository 
 * @param sqlObj 
 * @param id 
 */
export const updateDb = async (dynDbEntityRepository: Repository<DynDbEntity>, dbObj: DynDbEntity, id: number) => {
    return dynDbEntityRepository.update(id, dbObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 删除数据库配置
 * @param dynDbEntityRepository 
 * @param ids 
 */
export const deleteDb = async (dynDbEntityRepository: Repository<DynDbEntity>, ids: any) => {
    return dynDbEntityRepository.createQueryBuilder().
    update(DynDbEntity).
    set(
        {isRealDelete: true}
    ).
    where('id IN (:...ids)',{ids: ids}).
    execute().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};



/**
 * 删除Sql语句
 * @param dynSqlEntityRepository  
 * @param ids 
 */
export const deleteSql = async (dynSqlEntityRepository: Repository<DynSqlEntity>, ids: any) => {
    return dynSqlEntityRepository.createQueryBuilder().
    update(DynSqlEntity).
    set(
        {isRealDelete: true}
    ).
    where('id IN (:...ids)',{ids: ids}).
    execute().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};



/**
 * 更新sql语句
 * @param dynSqlEntityRepository 
 * @param sqlObj 
 * @param id 
 */
export const updateSql = async (dynSqlEntityRepository: Repository<DynSqlEntity>, sqlObj: DynSqlEntity, id: number) => {
    return dynSqlEntityRepository.update(id, sqlObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 查询所有的数据库配置
 * @param catalogEntityRepository
 * @param id
 */
export const findAllDynDb = async (dynDbEntityRepository: Repository<DynDbEntity>) => {
    return dynDbEntityRepository.createQueryBuilder('db').where(
        'db.isRealDelete = :isRealDelete', {isRealDelete: false}
    ).orderBy('db.updateDate', 'DESC');
};

/**
 * 查询所有的数据库配置
 * @param catalogEntityRepository
 * @param id
 */
export const findAllSqlByDbId = async (dynSqlEntityRepository: Repository<DynSqlEntity>, dbId: number) => {
    return dynSqlEntityRepository.createQueryBuilder('dynSql').where(
        qb => {
            if (dbId != null) {
                qb.where('dynSql.dynDb = :dynDb', { dynDb: dbId });
                qb.andWhere('dynSql.isRealDelete = :isRealDelete', {isRealDelete: false});
            }
            qb.where('dynSql.isRealDelete = :isRealDelete', {isRealDelete: false});
        }
    ).orderBy('dynSql.updateDate', 'DESC');
};

/**
 * 通过数据库ID查询数据库配置
 * @param dynDbEntityRepository 
 * @param id 
 */
export const queryDbById = async (dynDbEntityRepository: Repository<DynDbEntity>, dbId: number) => {
    return await dynDbEntityRepository.findOne(dbId).
        catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
}

/**
 * 通过sql ID查询sql语句
 * @param dynDbEntityRepository 
 * @param id 
 */
export const querySqlById = async (dynSqlEntityRepository: Repository<DynSqlEntity>, sqlId: number) => {
    return await dynSqlEntityRepository.createQueryBuilder('sqlEntity').
    leftJoinAndSelect('sqlEntity.dynDb', 'dynDb').
    where('sqlEntity.id = :id', { id: sqlId }).
    getOne().
        catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
}

/**
 * 通过别名查找sql
 * @param dynSqlEntityRepository 
 * @param alias 
 */
export const querySqlByAlias = async (dynSqlEntityRepository: Repository<DynSqlEntity>, alias: string) => {
    return await dynSqlEntityRepository.createQueryBuilder('sqlEntity').
    leftJoinAndSelect('sqlEntity.dynDb', 'dynDb').
    where('sqlEntity.sqlAlias = :sqlAlias', { sqlAlias: alias }).
    getOne().
        catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
}