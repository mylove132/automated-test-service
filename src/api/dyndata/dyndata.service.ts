/* eslint-disable no-useless-escape */
import {InjectRepository} from '@nestjs/typeorm';
import { DynSqlEntity } from './dynsql.entity';
import { Repository } from 'typeorm';
import { DynDbEntity } from './dyndb.entity';
import { findAllDynDb, findAllSqlByDbId, queryDbById, querySqlById, saveDb, saveSql, updateSql, updateDb, deleteDb, deleteSql } from 'src/datasource/dyndata/dyndata.sql';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CurlService } from '../curl/curl.service';
import { CommonUtil } from 'src/utils/common.util';
import { CreateSqlDto, UpdateSqlDto, DbIdsDto, SqlIdsDto } from './dto/dyndata.dto';
import { AxiosRequestConfig } from 'axios';
import * as FormData from "form-data";

export class DynDataService {

    constructor(
        @InjectRepository(DynSqlEntity)
        private readonly dynSqlRepository: Repository<DynSqlEntity>,
        @InjectRepository(DynDbEntity)
        private readonly dynDbRepository: Repository<DynDbEntity>,
        private curlService: CurlService
    ){}


    /**
     * 添加数据库配置
     * @param dynDbEntity 
     */
    async addDbService(dynDbEntity: DynDbEntity){
        dynDbEntity.dbPassword = CommonUtil.Encrypt(dynDbEntity.dbPassword, dynDbEntity.dbUsername);
        const result =  await saveDb(this.dynDbRepository, dynDbEntity);
        return {id: result.id};
    }

    /**
     * 添加sql语句
     * @param dynDbEntity 
     */
    async addSqlService(createSqlDto: CreateSqlDto){
        const sqlObj = new DynSqlEntity();
        sqlObj.name = createSqlDto.name;
        sqlObj.sql = createSqlDto.sql;
        sqlObj.dynDb = await queryDbById(this.dynDbRepository, createSqlDto.dbId);
        const result = await saveSql(this.dynSqlRepository, sqlObj);
        const sObj = new DynSqlEntity();
        sObj.sqlAlias = `sqlAlias${result.id}`;
        await updateSql(this.dynSqlRepository, sObj, result.id);
        return {id: result.id};
    }

    /**
     * 更新db配置
     * @param dynDbEntity 
     */
    async updateDbService(dynDbEntity: DynDbEntity){
        dynDbEntity.dbPassword = CommonUtil.Encrypt(dynDbEntity.dbPassword, dynDbEntity.dbUsername);
        updateDb(this.dynDbRepository, dynDbEntity, dynDbEntity.id);
    }

    /**
     * 删除数据库配置项
     * @param ids 
     */
    async delDbService(dbIdsDto: DbIdsDto){
        return await deleteDb(this.dynDbRepository, dbIdsDto.ids);
    }

     /**
     * 删除数据库配置项
     * @param ids 
     */
    async delSqlService(sqlIdsDto: SqlIdsDto){
        return await deleteSql(this.dynSqlRepository, sqlIdsDto.ids);
    }
    

    /**
     * 更新sql语句
     * @param updateSqlDto 
     */
    async updateSqlService(updateSqlDto: UpdateSqlDto){
        const sqlObj = new DynSqlEntity();
        if (updateSqlDto.name != null) sqlObj.name = updateSqlDto.name;
        if (updateSqlDto.sql != null) sqlObj.sql = updateSqlDto.sql;
        if (updateSqlDto.dbId != null) sqlObj.dynDb = await queryDbById(this.dynDbRepository, updateSqlDto.dbId);
        return await updateSql(this.dynSqlRepository, sqlObj, updateSqlDto.id);
    }
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


    /**
     * 执行sql语句
     * @param dbId 
     * @param sqlId 
     */
    async queryDataByDbIdAndSqlIdService(sqlId: number) {
        const sqlObj = await querySqlById(this.dynSqlRepository, sqlId);
        const result =  await this.curlService.query(sqlObj);
        return result;
    }

    /**
     * 根据数据库配置执行sql
     * @param dbId 
     * @param sql 
     */
    async runSqlService(dbId: number, sql: string) {
        const dynDbEntity = await queryDbById(this.dynDbRepository, dbId);
        return await this.curlService.runSql(dynDbEntity, sql);
    }

    /**
     * 检查mysql语法
     * @param sql 
     */
    async grammarCheckService(sql: string){
        const requestData: AxiosRequestConfig = {};
        requestData.url = 'http://cn.piliapp.com/mysql-syntax-check/checking/';
        requestData.method = 'POST';
        const form = new FormData();
        form.append('sql',sql);
        requestData.headers = form.getHeaders();
        requestData.data = form;
        return await this.curlService.makeRequest(requestData).toPromise();
    }
}
