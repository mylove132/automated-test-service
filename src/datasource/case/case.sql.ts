import { Repository } from "typeorm";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { HttpStatus } from "@nestjs/common";
import { CaseEntity } from "../../api/case/case.entity";
import { AssertJudgeEntity, AssertTypeEntity } from "../../api/case/assert.entity";
import { CaseGrade } from "../../config/base.enum";
import { CatalogEntity } from "../../api/catalog/catalog.entity";


/**
 * 通过id查询case
 * @param caseEntityRepository
 * @param id
 */
export const findCaseById = async (caseEntityRepository: Repository<CaseEntity>, id: number) => {
  return await caseEntityRepository.findOne(id).catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};

export const finCaseNamesByIds = async (caseEntityRepository: Repository<CaseEntity>, ids: any) => {
  return await caseEntityRepository.createQueryBuilder("case").select().
    where("case.id IN (:...ids)", { ids: ids }).
    andWhere("case.isRealDelete = :isRealDelete", {isRealDelete: false}).
    getMany().catch(
      err => {
        console.log(err);
        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    );
};



/**
 * 通过id查询case
 * @param caseEntityRepository
 * @param alias
 */
export const findCaseByAlias = async (caseEntityRepository: Repository<CaseEntity>, alias: string) => {
  return await caseEntityRepository.createQueryBuilder('cas').
    leftJoinAndSelect('cas.token', 'token').
    where('cas.alias = :alias', { alias: alias }).
    getOne().
    catch(
      err => {
        console.log(err);
        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    );
};



/**
 * 通过接口名称和接口路径查找接口
 * @param caseEntityRepository
 * @param path
 * @param name
 */
export const findCaseByPathAndName = async (caseEntityRepository: Repository<CaseEntity>, path: string, name: string) => {
  return await caseEntityRepository.createQueryBuilder("case").
  where("case.path = :path", { path: path }).
  andWhere("case.name = :name", { name: name }).
  andWhere("case.isRealDelete = :isRealDelete",{isRealDelete: false}).
  getOne().catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};


/**
 * 通过接口名称和接口路径查找接口
 * @param caseEntityRepository
 */
export const findCaseUnionEndpoint = async (caseEntityRepository: Repository<CaseEntity>) => {
  return await caseEntityRepository.createQueryBuilder("case").
  select("case.endpoint").
  groupBy("case.endpoint").
  addGroupBy("case.id").
  getMany().
  catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
};


/**
 * 通过目录ID和用例类型以及用例等级查询case
 * @param caseEntityRepository
 * @param catalogId
 * @param caseGradeList
 */
export const findCaseByCatalogIdAndCaseTypeAndCaseGrade = async (caseEntityRepository: Repository<CaseEntity>, 
  catalogId: number, caseGradeList: any) => {
  return caseEntityRepository.createQueryBuilder("cas").
    leftJoinAndSelect("cas.endpointObject", "endpoint").
    leftJoinAndSelect("cas.assertType", "assertType").
    leftJoinAndSelect("cas.assertJudge", "assertJudge").
    leftJoinAndSelect("cas.token", "token").
    leftJoinAndSelect("token.platformCode", "platformCode").
    leftJoinAndSelect("token.env", "env").where(qb => {
      if (catalogId) {
        qb.where("cas.catalog = :catalog", { catalog: catalogId });
        qb.andWhere("cas.caseGrade  IN (:...caseGradeList)", { caseGradeList: caseGradeList });
        qb.andWhere("cas.isRealDelete = :isRealDelete", { isRealDelete: false });
      } else {
        qb.where("cas.caseGrade  IN (:...caseGradeList)", { caseGradeList: caseGradeList });
        qb.andWhere("cas.isRealDelete = :isRealDelete", { isRealDelete: false });
      }
    }).orderBy("cas.updateDate", "DESC");
};


/**
 * 通过id查询case
 * @param caseEntityRepository
 * @param caseId
 */
export const findCaseOfEndpointAndTokenById = async (caseEntityRepository: Repository<CaseEntity>, caseId: number) => {
  return await caseEntityRepository.createQueryBuilder("case")
    .select()
    .leftJoinAndSelect("case.endpointObject", "endpointObj")
    .leftJoinAndSelect("case.token", "token")
    .leftJoinAndSelect("case.catalog", "catalog")
    .where("case.id = :id", { id: caseId })
    .getOne()
    .catch(
      err => {
        console.log(err);
        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    );
};


export const findCaseOfAssertTypeAndAssertJudgeById = async (caseEntityRepository: Repository<CaseEntity>, caseId) => {
  return await caseEntityRepository.createQueryBuilder("case")
    .select()
    .leftJoinAndSelect("case.assertType", "assertType")
    .leftJoinAndSelect("case.assertJudge", "assertJudge")
    .where("case.id = :id", { id: caseId })
    .getOne()
    .catch(
      err => {
        console.log(err);
        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
      }
    );
};


/**
 * 通过caseType查询case
 * @param caseEntityRepository
 * @param caseGrade
 * @param catalogIds
 */
export const findCaseByCaseGradeAndCatalogs = async (caseEntityRepository: Repository<CaseEntity>, caseGrade: CaseGrade, catalogIds: any) => {
  return await caseEntityRepository
    .createQueryBuilder("cas").where
    ("cas.caseGrade = :caseGrade", { caseGrade: caseGrade }).
    andWhere('cas.catalog IN (:...catalogs)', { catalogs: catalogIds }).
    andWhere('cas.isRealDelete = :isRealDelete', {isRealDelete: false}).
    getMany().
    catch(
      err => {
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
  );
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
  );
};

/**
 * 添加case实体
 * @param caseEntityRepository
 * @param caseObj
 */
export const saveCase = async (caseEntityRepository: Repository<CaseEntity>, caseObj) => {
  return await caseEntityRepository.save(caseObj)
    .catch(
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
export const deleteCase = async (caseEntityRepository: Repository<CaseEntity>, caseIds: any) => {
  return await caseEntityRepository.createQueryBuilder().update(CaseEntity).set({
    isRealDelete: true
  }).where('id IN (:...ids)',{ids: caseIds}).execute().
    catch(err => {
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
  return await caseEntityRepository.update(caseId, caseObj).catch(
    err => {
      console.log(err);
      throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
    }
  );
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


/**
 * 按名称模糊匹配接口
 * @param caseRepository
 * @param name
 */
export const searchCaseByName = async (caseRepository: Repository<CaseEntity>, name) => {
  return caseRepository.createQueryBuilder('cas').where(
    qb => {
      if (name) {
        qb.where("cas.name LIKE :param")
          .setParameters({
            param: '%' + name + '%'
          })
      }
    }
  ).orderBy('cas.createDate', 'DESC').getMany();
};


export const batchUpdateCaseOfCatalogId =
  async (caseRepository: Repository<CaseEntity>, caseIds: number[], catalog: CatalogEntity) => {
    caseRepository.createQueryBuilder().
      update(CaseEntity).
      set({
        catalog: catalog
      }).where('id IN (:...caseIds)', { caseIds: caseIds }).
      execute().
      catch(
        err => {
          console.log(err);
          throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
      )
  };
