import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from '../user/user.entity';
import { Repository} from 'typeorm';
import {CatalogEntity} from './catalog.entity';
import {CreateCatalogDto, DeleteCatalogDto, UpdateCatalogDto} from './dto/catalog.dto';
import {HttpStatus} from '@nestjs/common';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {CommonUtil} from '../../utils/common.util';
import {PlatformCodeEntity} from "./platformCode.entity";
import {
    deleteCatalogByIds,
    findCatalogById,
    findCatalogByPlatformCodes,
    saveCatalog, updateCatalog
} from '../../datasource/catalog/catalog.sql';
import {
    findAllPlatformCode,
    findPlatformCodeByCode,
    findPlatformCodeByCodeList
} from "../../datasource/platformCode/platform.sql";

export class CatalogService {
    constructor(
        @InjectRepository(PlatformCodeEntity)
        private readonly platformRepository: Repository<PlatformCodeEntity>,
        @InjectRepository(CatalogEntity)
        private readonly catalogRepository: Repository<CatalogEntity>
    ) {
    }

    /**
     * 添加目录
     * @param createCatalogDto
     */
    async addCatalog(createCatalogDto: CreateCatalogDto) {
        const { name, isPub, parentId, platformCode} = createCatalogDto;
        const catalog = new CatalogEntity();
        const platformObj = await findPlatformCodeByCode(this.platformRepository, platformCode);
        catalog.platformCode = platformObj;
        catalog.parentId = createCatalogDto.parentId;
        catalog.name = createCatalogDto.name;
        catalog.isPub = isPub;
        return await saveCatalog(this.catalogRepository, catalog);
    }


    /**
     * 查询目录
     * @param platformCode
     * @param isPub
     */
    async findCatalog(platformCode: string, isPub?: boolean): Promise<CatalogEntity[]> {
        let platformCodes = [];
        platformCode.indexOf(',') != -1 ? platformCodes = platformCode.split(',').map(pc => {return pc;}) : platformCodes.push(platformCode);
        const platformIdList = (await findPlatformCodeByCodeList(this.platformRepository, platformCodes)).map(pc => {return pc.id;});
        const result = await findCatalogByPlatformCodes(this.catalogRepository, platformIdList);
        return CommonUtil.getTree(result, isPub);
    }


    async findPlatformCode(): Promise<PlatformCodeEntity[]> {
        return await findAllPlatformCode(this.platformRepository);
    }



    /**
     * 删除目录
     * @param queryCatalogDto
     */
    async deleteById(deleteCatalogDto: DeleteCatalogDto) {
        return  await deleteCatalogByIds(this.catalogRepository, deleteCatalogDto.ids);
    }

    /**
     * 更新目录
     * @param updateCatalogDto
     */
    async updateCatalog(updateCatalogDto: UpdateCatalogDto): Promise<Object> {
        const {id, name, isPub, platformCode} = updateCatalogDto;
        const catalogObj = new CatalogEntity();
        const catalog = await findCatalogById(this.catalogRepository, id);
        const platformObj = await findPlatformCodeByCode(this.platformRepository, platformCode);
        if (!catalog) throw new ApiException(`更新目录id:${id}不存在`, ApiErrorCode.CATALOG_ID_INVALID, HttpStatus.BAD_REQUEST);
        catalogObj.isPub = isPub;
        catalogObj.platformCode = platformObj;
        if (catalog.name) catalogObj.name = name;
        return await updateCatalog(this.catalogRepository, catalogObj, id);

    }
}
