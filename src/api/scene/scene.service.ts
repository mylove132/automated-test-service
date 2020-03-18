import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {InsertResult, Repository} from 'typeorm';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
import {CatalogEntity} from "../catalog/catalog.entity";
import {SceneEntity} from "./scene.entity";
import {CreateSceneDto, DeleteSceneByIdDto, UpdateSceneDto} from "./dto/scene.dto";

@Injectable()
export class SceneService {
  constructor(
    @InjectRepository(CatalogEntity)
    private readonly catalogRepository: Repository<CatalogEntity>,
    @InjectRepository(SceneEntity)
    private readonly sceneRepository: Repository<SceneEntity>,
  ) {
  }

    /**
     * 添加场景
     * @param createSceneDto
     */
  async addSceneService(createSceneDto: CreateSceneDto){

      const sceneObj = new SceneEntity();
      const catalogId = createSceneDto.catalogId;
      const catalogObj = await this.catalogRepository.findOne(catalogId).catch(
          err => {
              console.log(err);
              throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
          }
      );
      if (!catalogObj) {
          throw new ApiException(`目录ID：${createSceneDto.catalogId}不存在`,ApiErrorCode.CATALOG_ID_INVALID, HttpStatus.BAD_REQUEST);
      }
      if (createSceneDto.sceneGrade){
          sceneObj.sceneGrade = createSceneDto.sceneGrade;
      }
      sceneObj.catalog = catalogObj;
      sceneObj.name = createSceneDto.name;
      sceneObj.desc = createSceneDto.desc;
      sceneObj.dependenceCaseJson = createSceneDto.caseList;
      const result: InsertResult = await this.sceneRepository.createQueryBuilder()
            .insert()
            .into(SceneEntity)
            .values(sceneObj)
            .execute().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );

      return {id: result.identifiers[0].id};
  }

    /**
     * 更新场景
     * @param updateSceneDto
     */
    async updateSceneService(updateSceneDto: UpdateSceneDto){

        const sceneObj = new SceneEntity();
        sceneObj.id = updateSceneDto.id;
        if (updateSceneDto.name){
            sceneObj.name = updateSceneDto.name;
        }
        if (updateSceneDto.catalogId){
            sceneObj.catalog = await this.catalogRepository.findOne(updateSceneDto.catalogId);
        }
        if (updateSceneDto.desc){
            sceneObj.desc = updateSceneDto.desc;
        }
        if (updateSceneDto.caseList){
            sceneObj.dependenceCaseJson = updateSceneDto.caseList;
        }
        if (updateSceneDto.sceneGrade){
            sceneObj.sceneGrade = updateSceneDto.sceneGrade;
        }
        const saveResult = await this.sceneRepository.createQueryBuilder().update(SceneEntity).
        set(sceneObj).where("id = :id",{id: updateSceneDto.id}).execute().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        return saveResult;
    }


    async deleteSceneById(deleteByIdDto: DeleteSceneByIdDto){
        const result = await this.sceneRepository.createQueryBuilder('scene').delete().
        where('scene.id IN (:...sceneIds)',{sceneIds: deleteByIdDto.sceneIds}).execute().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        return result;
    }


  /**
   * 获取所有的场景信息
   * @param {number, IPaginationOptions}: id, 页码信息
   * @return {Promise<Pagination<HistoryEntity>>}: 场景列表
   */
  async findSceneService(catalogId: number, caseGradeList:number[],options: IPaginationOptions): Promise<Pagination<SceneEntity>> {
    if (!catalogId) {
        const queryBuilder = await this.sceneRepository.createQueryBuilder("scene")
            .where('scene.catalogId = :catalogId',{catalogId: catalogId}).
            andWhere('scene.sceneGrade IN (:...sceneGrade)',{sceneGrade: caseGradeList}).orderBy('scene.createDate','DESC');
        return paginate<SceneEntity>(queryBuilder, options);
    } else {
        const queryBuilder = await this.sceneRepository.createQueryBuilder("scene").
        where('scene.sceneGrade IN (:...sceneGrade)',{sceneGrade: caseGradeList}).
        orderBy('scene.createDate','DESC');
        return paginate<SceneEntity>(queryBuilder, options);
        return await paginate<SceneEntity>(queryBuilder, options);
    }
  }
}
