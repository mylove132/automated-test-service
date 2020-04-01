import {Brackets, Repository} from "typeorm";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";
import {CaseEntity} from "../../api/case/case.entity";
import {AssertJudgeEntity, AssertTypeEntity} from "../../api/case/assert.entity";
import {CatalogEntity} from "../../api/catalog/catalog.entity";


/**
 * 通过id查询case
 * @param caseEntityRepository
 * @param id
 */
export const findCaseById = async (caseEntityRepository: Repository<CaseEntity>,id) => {
    return await caseEntityRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};



/**
 * 通过接口名称和接口路径查找接口
 * @param caseEntityRepository
 * @param path
 * @param name
 */
export const findCaseByPathAndName = async (caseEntityRepository: Repository<CaseEntity>, path, name) => {
    return await caseEntityRepository.createQueryBuilder('case').
    where('case.path = :path', {path: path}).
    andWhere('case.name = :name', {name: name}).
    getOne().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 通过接口名称和接口路径查找接口
 * @param caseEntityRepository
 */
export const findCaseUnionEndpoint = async (caseEntityRepository: Repository<CaseEntity>) => {
    return await caseEntityRepository.createQueryBuilder('case').
    select('case.endpoint').
    groupBy('case.endpoint').
    addGroupBy('case.id').
    getMany().catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};



/**
 * 通过目录ID和用例类型以及用例等级查询case
 * @param caseEntityRepository
 * @param catalogId
 * @param caseType
 * @param caseGradeList
 */
export const findCaseByCatalogIdAndCaseTypeAndCaseGrade = async (caseEntityRepository: Repository<CaseEntity>, catalogId, caseType, caseGradeList) => {
    return caseEntityRepository.createQueryBuilder('case').
    leftJoinAndSelect('case.endpointObject', 'endpoint').
    leftJoinAndSelect('case.assertType', 'assertType').
    leftJoinAndSelect('case.assertJudge', 'assertJudge').
    leftJoinAndSelect('case.token', 'token').
    leftJoinAndSelect('token.platformCode', 'platformCode').
    leftJoinAndSelect('token.env', 'env').
    where(qb => {
        if (catalogId) {
            qb.where('case.catalog = :catalog', {catalog: catalogId});
            if (caseType){
                qb.andWhere('case.caseType = :caseType', {caseType: caseType})
            }
        }else {
            if (caseType){
                qb.where('case.caseType = :caseType', {caseType: caseType})
            }
        }

    }).
    andWhere('case.caseGrade  IN (:...caseGradeList)', {caseGradeList: caseGradeList}).
    orderBy('case.updateDate', 'DESC');
};


/**
 * 通过id查询case
 * @param caseEntityRepository
 * @param caseId
 */
export const findCaseOfEndpointAndTokenById = async (caseEntityRepository: Repository<CaseEntity>,caseId) => {
  return await caseEntityRepository.createQueryBuilder('case')
    .select()
    .leftJoinAndSelect("case.endpointObject", 'endpointObj')
    .leftJoinAndSelect('case.token','token')
    .where('case.id = :id', {id: caseId})
    .getOne()
    .catch(
      err => {
        console.log(err);
        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    );
};


/**
 * 通过断言类型ID查询
 * @param assertTypeEntityRepository
 * @param id
 */
export const findAssertTypeById = async (assertTypeEntityRepository: Repository<AssertTypeEntity>, id) => {
    return await assertTypeEntityRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 通过断言判断条件ID查询
 * @param assertJudgeEntityRepository
 * @param id
 */
export const findAssertJudgeById = async (assertJudgeEntityRepository: Repository<AssertJudgeEntity>, id) => {
    return await assertJudgeEntityRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};

/**
 * 添加case实体
 * @param caseEntityRepository
 * @param caseObj
 */
export const saveCase = async (caseEntityRepository: Repository<CaseEntity>, caseObj) => {
    return await caseEntityRepository.createQueryBuilder()
        .insert()
        .into(CaseEntity)
        .values(caseObj)
        .execute().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            });
};

/**
 * 通过ID集合删除case
 * @param caseEntityRepository
 * @param caseIds
 */
export const deleteCase = async (caseEntityRepository: Repository<CaseEntity>, caseIds) => {
  return await caseEntityRepository.delete(caseIds)
    .catch(err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    });
};


/**
 * 更新case实体
 * @param caseEntityRepository
 * @param caseObj
 * @param caseId
 */
export const updateCase = async (caseEntityRepository: Repository<CaseEntity>, caseObj, caseId) => {
    return await caseEntityRepository.createQueryBuilder().
    update(CaseEntity).set(caseObj).
    where('id = :id',{id: caseId}).
    execute().
    catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
};


/**
 * 获取所有的断言类型
 * @param assertTypeEntityRepository
 */
export const findAllAssertType = async (assertTypeEntityRepository: Repository<AssertTypeEntity>) => {
    return await assertTypeEntityRepository.createQueryBuilder().getMany().catch(err => {
        console.log(err);
        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    });
};


/**
 * 获取所有的断言条件
 * @param assertJudgeEntityRepository
 */
export const findAllAssertJudge = async (assertJudgeEntityRepository: Repository<AssertJudgeEntity>) => {
    return await assertJudgeEntityRepository.createQueryBuilder().getMany().catch(err => {
        console.log(err);
        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    });
};
