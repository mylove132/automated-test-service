import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../user/user.entity";
import {Repository, TreeRepository} from "typeorm";
import {CatalogEntity} from "./catalog.entity";
import {CreateCatalogDto} from "./dto/create-catalog.dto";
import {HttpException, HttpStatus} from "@nestjs/common";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {CatalogRO} from './catalog.interface';

export class CatalogService {

  constructor(
      @InjectRepository(UserEntity)
      private readonly userRepository: Repository<UserEntity>,
      @InjectRepository(CatalogEntity)
      private readonly catalogRepository: TreeRepository<CatalogEntity>
  ){}

  async addCatalog(createCatalogDto: CreateCatalogDto){
      const catalog = new CatalogEntity();
      const user = await this.userRepository.findOne(createCatalogDto.userId);
      catalog.name = createCatalogDto.name;
      if (user){
          catalog.user = user;
      }else {
          throw new ApiException('用户id不存在.',ApiErrorCode.USER_ID_INVALID, HttpStatus.BAD_REQUEST);
      }
      if (createCatalogDto.parentId) {
          const parent = await this.catalogRepository.findOne(createCatalogDto.parentId);
          if (parent){
              catalog.parent = parent;
          }else{
              throw new ApiException('parentId 不存在.',ApiErrorCode.CATALOG_PARENT_INVALID, HttpStatus.BAD_REQUEST);
          }
      }
      const saveResult = await this.catalogRepository.save(catalog);
      return saveResult;
  }
  async findCatalogByUserId(userId: number): Promise<CatalogEntity[]> {
      const result = await this.catalogRepository.findTrees();
      console.log(result);
     return result;
  }

    private buildCatalogRO(catalogs: CatalogEntity[]) {
      let list = [];
      catalogs.forEach(
          cata => {
              const catalogRO = {
                  user:{username: cata.user.username,
                      email: cata.user.email,
                      userId: cata.user.id,
                  },
                  catalogName: cata.name,
                  catalogId: cata.id,
                  createDate: cata.createDate,
                  updateDate: cata.updateDate
              };
              list.push(catalogRO);
          }
      )


        return {catalog: list};
    }
}
