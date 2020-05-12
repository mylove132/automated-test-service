/* eslint-disable no-useless-escape */
import {InjectRepository} from '@nestjs/typeorm';
import { DynSqlEntity } from './dynsql.entity';
import { Repository } from 'typeorm';
import { DynDbEntity } from './dyndb.entity';
import { findAllDynDb, findAllSqlByDbId } from 'src/datasource/dyndata/dyndata.sql';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

export class DynDataService {

    constructor(
        @InjectRepository(DynSqlEntity)
        private readonly dynSqlRepository: Repository<DynSqlEntity>,
        @InjectRepository(DynDbEntity)
        private readonly dynDbRepository: Repository<DynDbEntity>,
    ){}

    /**
     * 获取所有的数据库配置
     */
    async getAllDynDbService(options: IPaginationOptions){ 
        const queryBuilder =  await findAllDynDb(this.dynDbRepository);
        return await paginate<DynDbEntity>(queryBuilder, options);
    }

    /**
     * 根据数据获取相关的sql列表
     */
    async getAllSqlByDbIdService(dbId: number, options: IPaginationOptions){ 
        const queryBuilder =  await findAllSqlByDbId(this.dynSqlRepository, dbId);
        return await paginate<DynSqlEntity>(queryBuilder, options);
    }

}
