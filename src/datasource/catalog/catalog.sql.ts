import {Repository} from "typeorm";
import {CatalogEntity} from "../../api/catalog/catalog.entity";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";

/**
 * 通过目录ID查询实体
 * @param catalogEntityRepository
 * @param id
 */
export const findCatalogById = async (catalogEntityRepository: Repository<CatalogEntity>, id: number) => {
    return await catalogEntityRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 通过id集合查找目录
 * @param catalogEntityRepository
 * @param ids
 */
export const findCatalogByIds = async (catalogEntityRepository: Repository<CatalogEntity>, ids: any) => {
    return await catalogEntityRepository.createQueryBuilder('catalog').
      where('catalog.id IN (:...ids)',{ids: ids}).
      andWhere('catalog.isRealDelete = :isRealDelete',{isRealDelete: false}).
    getMany().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

export const findCatalogOfCaseByIds = async (catalogEntityRepository: Repository<CatalogEntity>, ids) => {
    return await catalogEntityRepository.createQueryBuilder('catalog').
        leftJoinAndSelect('catalog.cases','cases').
    where('catalog.id IN (:...ids)',{ids: ids}).
    andWhere('catalog.isRealDelete = :isRealDelete',{isRealDelete: false}).
    getMany().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 *
 * 保存目录实体
 * @param catalogEntityRepository
 * @param catalogObj
 */
export const saveCatalog = async (catalogEntityRepository: Repository<CatalogEntity>, catalogObj: any) => {
    return await catalogEntityRepository.save(catalogObj).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 通过platformcode集合查询目录
 * @param catalogEntityRepository
 * @param platformCodes
 */
export const findCatalogByPlatformCodes = async (catalogEntityRepository: Repository<CatalogEntity>, platformCodes: any) => {
    return await catalogEntityRepository.createQueryBuilder('catalog').
    where('catalog.platformCode IN (:...platforms)', {platforms: platformCodes}).
    andWhere('catalog.isRealDelete = :isRealDelete',{isRealDelete: false}).
    leftJoinAndSelect('catalog.platformCode', 'platformCode').
    orderBy('catalog.createDate', 'DESC').
    getMany().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};



/**
 * 更新目录实体
 * @param catalogEntityRepository
 * @param catalogObj
 * @param id
 */
export const updateCatalog = async (catalogEntityRepository: Repository<CatalogEntity>, catalogObj: any, id: number) => {
    return await catalogEntityRepository.createQueryBuilder('catalog').
    update(CatalogEntity).set(catalogObj).
    where('catalog.id = :id',{id: id}).
    execute().
    catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 删除目录
 * @param catalogEntityRepository
 * @param catalogIds
 */
export const deleteCatalogByIds = async (catalogEntityRepository: Repository<CatalogEntity>, catalogIds: any) => {
    return await catalogEntityRepository.createQueryBuilder().update(CatalogEntity).
    set(
        {isRealDelete: true}
    ).where('id IN (:...ids)',{ids: catalogIds}).execute().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};
