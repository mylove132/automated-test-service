import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from '../user/user.entity';
import { Repository} from 'typeorm';
import {CatalogEntity} from './catalog.entity';
import {CreateCatalogDto, QueryCatalogDto, UpdateCatalogDto} from './dto/catalog.dto';
import {HttpStatus} from '@nestjs/common';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {CommonUtil} from '../../util/common.util';
import {PlatformCodeEntity} from "./platformCode.entity";

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
        const platformObj = await this.platformRepository.createQueryBuilder('platform').
        where('platform.platformCode = :platformCode',{platformCode: platformCode}).getOne();
        catalog.platformCode = platformObj;
        catalog.name = createCatalogDto.name;
        let isFlag: boolean;
        if (isPub) {
            isFlag = isPub.toLocaleLowerCase() == 'true' ? true : false;
        } else {
            isFlag = false;
        }
        if (createCatalogDto.parentId) {
            isFlag = false;
            const parent = await this.catalogRepository.findOne(createCatalogDto.parentId).catch(
                err => {
                    console.log(err)
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!parent) {
                throw new ApiException('parentId 不存在.', ApiErrorCode.CATALOG_PARENT_INVALID, HttpStatus.BAD_REQUEST);
            }
            catalog.parentId = createCatalogDto.parentId;
        }
        catalog.isPub = isFlag;
        const saveResult = await this.catalogRepository.save(catalog).catch(
            err => {
                console.log(err)
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        )
        return saveResult;
    }


    /**
     * 查询目录
     * @param platformCode
     * @param isPub
     */
    async findCatalog(platformCode: string, isPub?: boolean): Promise<CatalogEntity[]> {
        let result;
        let platformCodes = [];
        if (platformCode.indexOf(",") != -1){
           const ps = platformCode.split(',');
           for (let p of ps){
               platformCodes.push(p.toString());
           }}
         else {
            platformCodes.push(platformCode);
        }
        console.log(platformCodes)
        const platformObjList = await this.platformRepository.createQueryBuilder('platform').
            where("platform.platformCode IN (:...platformCodes)", { platformCodes: platformCodes }).getMany().catch(
            err => {
                console.log(err)
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
         let pcIds = [];
         for (let pcObj of platformObjList){
             pcIds.push(pcObj.id);
         }
        result = await this.catalogRepository.createQueryBuilder('catalog').
        where('catalog.platformCode IN (:...platforms)',{platforms: pcIds}).
        leftJoinAndSelect('catalog.platformCode','platformCode').
        orderBy('catalog.createDate','DESC').getMany().catch(
            err => {
                console.log(err)
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        console.log(result);
        return this.getTree(result, isPub);
    }


    /**
     * 目录改为树结构输出
     * @param oldArr
     * @param isPub
     */
    private getTree(oldArr, isPub) {
        oldArr.forEach(element => {
            let parentId = element.parentId;
            if (parentId !== 0) {
                oldArr.forEach(ele => {
                    if (ele.id == parentId) { //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
                        if (!ele.children) {
                            ele.children = [];
                        }
                        ele.children.push(element);
                    }
                });
            }
        });
        if (isPub == null){
            oldArr = oldArr.filter(ele => ele.parentId === null); //这一步是过滤，按树展开，将多余的数组剔除；
            return oldArr;
        }
        oldArr = oldArr.filter(ele => { const x = isPub === "true" ? true:false;
            return (ele.parentId === null && ele.isPub === x )}); //这一步是过滤，按树展开，将多余的数组剔除；
        return oldArr;
    }

    /**
     * 删除目录
     * @param queryCatalogDto
     */
    async deleteById(queryCatalogDto: QueryCatalogDto) {
        queryCatalogDto.ids.forEach(
            id => {
                if (!CommonUtil.isNumber(id)){
                    throw new ApiException(`数组值${id}必须为数字`, ApiErrorCode.PARAM_VALID_FAIL,HttpStatus.BAD_REQUEST);
                }
            }
        );
        let res = [];
        if (queryCatalogDto.ids.length == 0){
           return res;
        }
        for (const delId of queryCatalogDto.ids) {
            const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id', {id: delId}).getOne().catch(
                err => {
                    console.log(err)
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!catalog) {
                throw new ApiException(`删除id:${delId}不存在`, ApiErrorCode.CATALOG_ID_INVALID, HttpStatus.BAD_REQUEST);
            } else {
                const result = await this.catalogRepository.createQueryBuilder().delete().where('id = :id', {id: delId}).execute().catch(
                    err => {
                        console.log(err)
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                    }
                );
                res.push(
                    {
                        id: delId,
                        result: true
                    }
                )
            }
        }
        return  res;

    }

    /**
     * 更新目录
     * @param updateCatalogDto
     */
    async updateCatalog(updateCatalogDto: UpdateCatalogDto): Promise<Object> {
        const {id, name, isPub} = updateCatalogDto;
        const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id', {id: Number(id)}).getOne();
        if (!catalog) {
            throw new ApiException(`更新id:${id}不存在`, ApiErrorCode.CATALOG_ID_INVALID, HttpStatus.BAD_REQUEST);
        }
        let isFlag: boolean;
        if (isPub) {
            isFlag = isPub.toLocaleLowerCase() == 'true' ? true : false;
        } else {
            isFlag = false;
        }
        if (catalog.parentId != null){
            isFlag = false;
        }
        return await this.catalogRepository.createQueryBuilder().update(CatalogEntity).set({
            id: id,
            name: name,
            isPub: isFlag

        }).where(
            '"id" = :id', {id: id}
        ).execute().catch(
            err => {
                console.log(err)
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );

    }
}
