import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as fs from 'fs';
import {ConfigService} from "../../config/config.service";
import {JmeterEntity} from "./jmeter.entity";
import {CreateJmeterDto, JmeterIdsDto, UpdateJmeterDto} from "./dto/jmeter.dto";
import {
    createJmeter,
    deleteJmeterByIds,
    findJmeterById,
    updateJmeterById,
    findJmeterResultList,
    findJmeterList,
    findJmeterResultListById
} from "../../datasource/jmeter/jmeter.sql";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {execSync} from 'child_process';
import { JmeterResultEntity } from './jmeter_result.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Logger } from '../../utils/log4js';

/**
 * jmeter业务处理类
 * 
 */
@Injectable()
export class JmeterService {

    config = new ConfigService(`env/${process.env.NODE_ENV}.env`);

    constructor(
        @InjectRepository(JmeterEntity)
        private readonly jmeterRepository: Repository<JmeterEntity>,
        @InjectRepository(JmeterResultEntity)
        private readonly jmeterResultRepository: Repository<JmeterResultEntity>,
    ) {
    }

    /**
     * 分页信息
     * @param options
     */
    async paginate(options: IPaginationOptions): Promise<Pagination<JmeterResultEntity>> {
        return await paginate<JmeterResultEntity>(this.jmeterResultRepository, options);
    }

    // /**
    //  * 上传jmx文件
    //  * @param file
    //  * @param createJmeterDto
    //  */
    // async uploadFile(createJmeterDto: CreateJmeterDto) {
    //     console.log('---------------'+JSON.stringify(createJmeterDto));
    //     const jmeterObj = new JmeterEntity();
    //     const fileName = file.originalname;
    //     jmeterObj.name = fileName;
    //     jmeterObj.loopNum = createJmeterDto.loopNum;
    //     jmeterObj.preCountNumber = createJmeterDto.preCountNumber;
    //     jmeterObj.preCountTime = createJmeterDto.preCountTime;
    //     jmeterObj.remote_address = createJmeterDto.remote_address;
    //     return await createJmeter(this.jmeterRepository, createJmeterDto);

    // }


    /**
     * 创建压测信息
     * @param createJmeterDto
     */
    async createJmeterInfoService(createJmeterDto: CreateJmeterDto) {
        Logger.info(`创建jmeter脚本数据：JSON.stringify(createJmeterDto)`);
        return await createJmeter(this.jmeterRepository, createJmeterDto);
    }


    /**
     * 更新jmeter信息
     * @param updateJmeterDto
     */
    async updateJmeterInfoService(updateJmeterDto: UpdateJmeterDto) {

        const jmeterTmpObj = await findJmeterById(this.jmeterRepository, updateJmeterDto.id);
        if (!jmeterTmpObj) throw new ApiException(`ID为:${updateJmeterDto.id}的jmeter数据不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.PARTIAL_CONTENT);

        let jmeterObj = new JmeterEntity();
        if (updateJmeterDto.remote_address != null) jmeterObj.remote_address = updateJmeterDto.remote_address;
        if (updateJmeterDto.loopNum != null) jmeterObj.loopNum = updateJmeterDto.loopNum;
        if (updateJmeterDto.preCountNumber != null) jmeterObj.preCountNumber = updateJmeterDto.preCountNumber;
        if (updateJmeterDto.preCountTime != null) jmeterObj.preCountTime = updateJmeterDto.preCountTime;
        if (updateJmeterDto.name != null) jmeterObj.name = updateJmeterDto.name;

        Logger.info(`更新jmeter脚本数据：${JSON.stringify(jmeterObj)}`);
        return await updateJmeterById(this.jmeterRepository, jmeterObj, updateJmeterDto.id);
    }

    /**
     * 删除jmeter信息
     * @param jmeterIdsDto
     */
    async deleteJmeterInfoService(jmeterIdsDto: JmeterIdsDto) {
        Logger.info(`删除的脚本ID：${jmeterIdsDto.ids}`)
       return  await deleteJmeterByIds(this.jmeterRepository, jmeterIdsDto.ids);
    }


    /**
     * 
     * 查询报告
     * @param md5 
     */
    async findResultService(md5: string){
        const jmeterResultUrl = this.config.jmeterResultUrl;
        const jmeterHtmlPath = this.config.jmeterHtmlPath;

        if (!fs.existsSync(jmeterHtmlPath+`/${md5}`)){
            throw new ApiException(`${md5}文件夹不存在,请确认脚本是否执行成功。`,ApiErrorCode.JTL_FILE_UNEXIST, HttpStatus.BAD_REQUEST);
        }
        return {url: `${jmeterResultUrl}/${md5}/index.html`};
    }


    /**
     * 查询脚本列表
     * @param name 
     * @param options 
     */
    async queryJmeterListService(name: string, options: IPaginationOptions) {
        const queryBuilder = findJmeterList(this.jmeterRepository, name);
        return await paginate<JmeterEntity>(queryBuilder, options);
    }

    /**
     * 查询脚本运行结果列表
     * @param name 
     * @param options 
     */
    async queryJmeterResultListService(name: string, options: IPaginationOptions) {
        const queryBuilder = findJmeterResultList(this.jmeterResultRepository, name);
        return await paginate<JmeterResultEntity>(queryBuilder, options);
    }


    /**
     * 通过jmeterId查询结果
     * @param id 
     * @param options 
     */
    async queryJmeterResultListByJmeterIdService(jmeterId: number, options: IPaginationOptions) {
        const queryBuilder = findJmeterResultListById(this.jmeterResultRepository, jmeterId);
        return await paginate<JmeterResultEntity>(queryBuilder, options);
    }


    /**
     * 查看jmeter执行的日志信息
     * @param md5 
     */
    async catLogService(md5: string){
        const jmeterLogPath = this.config.jmeterLogPath;
        if (!fs.existsSync(`${jmeterLogPath}/${md5}.log`)) {
            throw new ApiException(`查看的log日志文件:${md5}.log 不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        return fs.readFileSync(`${jmeterLogPath}/${md5}.log`, {encoding: 'utf-8'});
    }
}


