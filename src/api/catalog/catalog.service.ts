import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from '../user/user.entity';
import {DeleteResult, Repository} from 'typeorm';
import {CatalogEntity} from './catalog.entity';
import {CreateCatalogDto, DeleteCatalogDto, QueryCatalogDto, UpdateCatalogDto} from './dto/catalog.dto';
import {HttpStatus} from '@nestjs/common';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';

export class CatalogService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(CatalogEntity)
        private readonly catalogRepository: Repository<CatalogEntity>
    ) {
    }

    async addCatalog(createCatalogDto: CreateCatalogDto) {
        const {userId, name, isPub, parentId} = createCatalogDto;
        const catalog = new CatalogEntity();
        const user = await this.userRepository.findOne(createCatalogDto.userId).catch(
            err => {
                console.log(err)
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        catalog.name = createCatalogDto.name;
        let isFlag: boolean;
        if (isPub) {
            isFlag = isPub.toLocaleLowerCase() == 'true' ? true : false;
        } else {
            isFlag = false;
        }
        if (user) {
            catalog.user = user;
        } else {
            throw new ApiException('用户id不存在.', ApiErrorCode.USER_ID_INVALID, HttpStatus.BAD_REQUEST);
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

    async findCatalog(queryCatalogDto: QueryCatalogDto): Promise<CatalogEntity[]> {
        const {userId, isPub} = queryCatalogDto;
        let isFlag: boolean;
        if (isPub) {
            isFlag = isPub.toLocaleLowerCase() == 'true' ? true : false;
        } else {
            isFlag = null;
        }
        let result = [];
        if (userId && isFlag != null) {
            console.log(userId);
            console.log(isFlag);
            result = await this.catalogRepository.createQueryBuilder().select().where('"userId" = :userId', {userId: userId}).andWhere('"isPub" = :isPub', {isPub: isFlag}).
            orderBy('id', 'ASC').getMany().catch(
                err => {
                    console.log(err)
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
        } else if (userId) {
            result = await this.catalogRepository.createQueryBuilder().select().where('"userId" = :userId', {userId: userId}).
            orderBy('id', 'ASC').getMany().catch(
                err => {
                    console.log(err)
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
        } else if (isPub != null) {
            result = await this.catalogRepository.createQueryBuilder().select().andWhere('"isPub" = :isPub', {isPub: isFlag}).
            orderBy('id', 'ASC').getMany().catch(
                err => {
                    console.log(err)
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
        } else {
            result = await this.catalogRepository.createQueryBuilder().select().orderBy('id', 'ASC').getMany().catch(
                err => {
                    console.log(err)
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
        }
        return this.getTree(result);

    }


    private getTree(oldArr) {
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
        oldArr = oldArr.filter(ele => ele.parentId === null); //这一步是过滤，按树展开，将多余的数组剔除；
        return oldArr;
    }

    async deleteById(ids: string) {
        let delList = ids.split(',');
        let res = [];
        for (const delId of delList) {
            const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id', {id: Number(delId)}).getOne().catch(
                err => {
                    console.log(err)
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!catalog) {
                throw new ApiException(`删除id:${delId}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
            } else {
                const result = await this.catalogRepository.createQueryBuilder().delete().where('id = :id', {id: Number(delId)}).execute().catch(
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

    async updateCatalog(updateCatalogDto: UpdateCatalogDto): Promise<Object> {
        const {id, name, isPub} = updateCatalogDto;
        const catalog = await this.catalogRepository.createQueryBuilder().select().where('id = :id', {id: Number(id)}).getOne();
        if (!catalog) {
            throw new ApiException(`更新id:${id}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
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

    private buildCatalogRO(catalogs: CatalogEntity[]) {
        let list = [];
        catalogs.forEach(
            cata => {
                const catalogRO = {
                    user: {
                        username: cata.user.username,
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
        );

        return {catalog: list};
    }
}
