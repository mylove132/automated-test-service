import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {InsertResult, Repository} from 'typeorm';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
import {CatalogEntity} from "../catalog/catalog.entity";
import {SceneEntity} from "./scene.entity";
import {CreateSceneDto} from "./dto/scene.dto";

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
   * 获取所有的场景信息
   * @param {number, IPaginationOptions}: id, 页码信息
   * @return {Promise<Pagination<HistoryEntity>>}: 场景列表
   */
  async findSceneService(catalogId: number, options: IPaginationOptions): Promise<Pagination<SceneEntity>> {
    if (!catalogId) {
        const queryBuilder = await this.sceneRepository.createQueryBuilder("scene")
            .where('scene.catalogId = :catalogId',{catalogId: catalogId}).orderBy('scene.createDate','DESC');
        return paginate<SceneEntity>(queryBuilder, options);
    } else {
        const queryBuilder = await this.sceneRepository.createQueryBuilder("scene")
           .orderBy('scene.createDate','DESC');
        return paginate<SceneEntity>(queryBuilder, options);
        return await paginate<SceneEntity>(queryBuilder, options);
    }
  }
}
