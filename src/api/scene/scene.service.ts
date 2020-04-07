import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeleteResult, InsertResult, Repository, UpdateResult} from 'typeorm';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
import {CatalogEntity} from "../catalog/catalog.entity";
import {SceneEntity} from "./scene.entity";
import {CreateSceneDto, DeleteSceneByIdDto, UpdateSceneDto} from "./dto/scene.dto";
import {findCatalogById} from "../../datasource/catalog/catalog.sql";
import {deleteScene, findScene, saveScene, updateScene} from "../../datasource/scene/scene.sql";

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
      const catalogObj = await findCatalogById(this.catalogRepository, createSceneDto.catalogId);
      if (!catalogObj) throw new ApiException(`目录ID：${createSceneDto.catalogId}不存在`,ApiErrorCode.CATALOG_ID_INVALID, HttpStatus.BAD_REQUEST);
      if (createSceneDto.sceneGrade) sceneObj.sceneGrade = createSceneDto.sceneGrade;

      sceneObj.catalog = catalogObj;
      sceneObj.name = createSceneDto.name;
      sceneObj.desc = createSceneDto.desc;
      sceneObj.dependenceCaseJson = createSceneDto.caseList;
      const result: InsertResult = await saveScene(this.sceneRepository, sceneObj);
      return {id: result.identifiers[0].id};
  }

    /**
     * 更新场景
     * @param updateSceneDto
     */
    async updateSceneService(updateSceneDto: UpdateSceneDto){

        const sceneObj = new SceneEntity();
        sceneObj.id = updateSceneDto.id;
        if (updateSceneDto.name) sceneObj.name = updateSceneDto.name;
        if (updateSceneDto.catalogId) sceneObj.catalog = await this.catalogRepository.findOne(updateSceneDto.catalogId);
        if (updateSceneDto.desc) sceneObj.desc = updateSceneDto.desc;
        if (updateSceneDto.caseList) sceneObj.dependenceCaseJson = updateSceneDto.caseList;
        if (updateSceneDto.sceneGrade) sceneObj.sceneGrade = updateSceneDto.sceneGrade;
        const saveResult: UpdateResult = await updateScene(this.sceneRepository, updateSceneDto.id, sceneObj);
        return saveResult;
    }


    async deleteSceneById(deleteByIdDto: DeleteSceneByIdDto){
        const result: DeleteResult = await deleteScene(this.sceneRepository, deleteByIdDto.sceneIds);
        return result;
    }


  /**
   * 获取所有的场景信息
   * @return {Promise<Pagination<HistoryEntity>>}: 场景列表
   * @param catalogId
   * @param sceneGradeList
   * @param options
   */
  async findSceneService(catalogId: number, sceneGradeList: number[],options: IPaginationOptions): Promise<Pagination<SceneEntity>> {
      const queryBuilder = await findScene(this.sceneRepository, catalogId, sceneGradeList);
      return await paginate<SceneEntity>(queryBuilder, options);
  }
}
