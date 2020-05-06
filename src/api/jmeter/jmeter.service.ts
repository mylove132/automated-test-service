import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as fs from 'fs';
import {ConfigService} from "../../config/config.service";
import {JmeterEntity} from "./jmeter.entity";
import * as crypto from "crypto";
import {CommonUtil} from "../../utils/common.util";
import {CreateJmeterDto, JmeterIdsDto, UpdateJmeterDto, JmeterIdDto} from "./dto/jmeter.dto";
import {
    createJmeter,
    deleteJmeterByIds,
    findJmeterById,
    findJmeterByIds,
    findJmeterByMd5,
    updateJmeterById,
    updateJmeterMd5ById,
    saveJmeterResult,
    findJmeterResultList,
    findJmeterList,
    findJmeterResultListById
} from "../../datasource/jmeter/jmeter.sql";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {exec, fork, execSync} from 'child_process';
import { JmeterResultEntity } from './jmeter_result.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';


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


    /**
     * 获取所有的历史记录列表
     * @param {number, IPaginationOptions}: id, 页码信息
     * @return {Promise<Pagination<HistoryEntity>>}: 历史记录列表
     */
    async jmeterDownload() {
        return fs.readFileSync('/Users/liuzhanhui/lzh/workspace/node/automated-test-service/src/config/request.jmx');
    }

    /**
     * 上传jmx文件
     * @param file
     */
    async uploadFile(file) {
        const fileName = file.originalname;
        const md5 = crypto.createHmac("sha256", new Date() + CommonUtil.randomChar(10)).digest("hex");
        fs.writeFileSync(this.config.jmeterJmxPath + `/${md5}.jmx`, file.buffer);
        return {
            fileName: fileName,
            md5: md5
        }
    }


    /**
     * 创建压测信息
     * @param createJmeterDto
     */
    async createJmeterInfo(createJmeterDto: CreateJmeterDto) {
        let fileList = fs.readdirSync(this.config.jmeterJmxPath);
        fileList = fileList.map(file => {
            return file.split('.')[0]
        });
        if (fileList.indexOf(createJmeterDto.md5) == -1) {
            throw new ApiException(`md5值：${createJmeterDto.md5}文件不存在`,
                ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.PARTIAL_CONTENT);
        }
        const jmeterObj = await findJmeterByMd5(this.jmeterRepository, createJmeterDto.md5);
        if (jmeterObj) throw new ApiException(`md5值：${createJmeterDto.md5}已存在`,
            ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        return await createJmeter(this.jmeterRepository, createJmeterDto);
    }


    /**
     * 更新jmeter信息
     * @param updateJmeterDto
     */
    async updateJmeterInfo(updateJmeterDto: UpdateJmeterDto) {

        const jmeterTmpObj = await findJmeterById(this.jmeterRepository, updateJmeterDto.id);
        if (!jmeterTmpObj) throw new ApiException(`ID为:${updateJmeterDto.id}的jmeter数据不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.PARTIAL_CONTENT);

        let jmeterObj = new JmeterEntity();
        if (updateJmeterDto.remote_address != null) jmeterObj.remote_address = updateJmeterDto.remote_address;
        if (updateJmeterDto.loopNum != null) jmeterObj.loopNum = updateJmeterDto.loopNum;
        if (updateJmeterDto.preCountNumber != null) jmeterObj.preCountNumber = updateJmeterDto.preCountNumber;
        if (updateJmeterDto.preCountTime != null) jmeterObj.preCountTime = updateJmeterDto.preCountTime;
        if (updateJmeterDto.name != null) jmeterObj.name = updateJmeterDto.name;
        return await updateJmeterById(this.jmeterRepository, jmeterObj, updateJmeterDto.id);
    }

    /**
     * 删除jmeter信息
     * @param jmeterIdsDto
     */
    async deleteJmeterInfo(jmeterIdsDto: JmeterIdsDto) {
        const jmeterList = await findJmeterByIds(this.jmeterRepository, jmeterIdsDto.ids);
        jmeterList.forEach(
            jmeter => {
                const path = this.config.jmeterJmxPath+`/${jmeter.md5}.jmx`;
                if (fs.existsSync(path)){
                    fs.unlinkSync(path);
                } 
            }
        );
       return  await deleteJmeterByIds(this.jmeterRepository, jmeterIdsDto.ids);
    };

    // async runJmeterFile(jmeterIdDto: JmeterIdDto){
    //     const jmeterBinPath = this.config.jmeterBinPath;
    //     const jmeterJtlPath = this.config.jmeterJtlPath;
    //     const jmeterJmxPath = this.config.jmeterJmxPath;
    //     const jmeterLogPath = this.config.jmeterLogPath;

    //     const jmeter = await findJmeterById(this.jmeterRepository, jmeterIdDto.id);
    //     const jmeterCountNum = jmeter.preCountNumber;
    //     const preCountTime = jmeter.preCountTime;
    //     const loopNum = jmeter.loopNum;
    //     const remote_address = jmeter.remote_address == null ? '' : '-R'+jmeter.remote_address;

    //     let newJmeter: JmeterEntity;
    //     //更新md5值
    //     if (fs.existsSync(this.config.jmeterJtlPath+`/${jmeter.md5}.jtl`)){
    //         const md5 = crypto.createHmac("sha256", new Date() + CommonUtil.randomChar(10)).digest("hex");
    //         const newJmxPath = this.config.jmeterJmxPath+`/${md5}.jmx`;
    //         fs.copyFileSync(this.config.jmeterJmxPath+`/${jmeter.md5}.jmx`, newJmxPath);
    //         await updateJmeterMd5ById(this.jmeterRepository, md5, jmeter.id);
    //         newJmeter = await findJmeterById(this.jmeterRepository, jmeter.id);
    //     } else {
    //         newJmeter = jmeter;
    //     }
    //     const cmd = `${jmeterBinPath} -n -t ${jmeterJmxPath}/${newJmeter.md5}.jmx -Jconcurrent_number=${jmeterCountNum} -Jduration=${preCountTime} -Jcycles=${loopNum} -j ${jmeterLogPath}/${newJmeter.md5}.log -l ${jmeterJtlPath}/${newJmeter.md5}.jtl`;
    //     const child = exec(cmd, (error, stdout, stderr) => {
    //         if (error) {
    //             throw new ApiException(`${jmeter.name} => 执行压测失败`, ApiErrorCode.TIMEOUT, HttpStatus.PARTIAL_CONTENT);
    //         };
    //     });
    //     child.stdout.on('data',(data)=>{
    //         console.log('---------------'+data);
    //     });
    //     //判断命令行是否执行成功
    //     const result = await new Promise((resolve, reject)=>{
    //         let num = 0;
    //         const inerval = setInterval(() => {
    //             if (fs.existsSync(this.config.jmeterJtlPath+`/${jmeter.md5}.jtl`)){
    //                 clearInterval(inerval);
    //                 resolve({status: true});
    //             }else{
    //                 if (num > 30){
    //                     clearInterval(inerval);
    //                     reject({status: false});
    //                     num++;
    //                 }
    //             }
    //         }, 1000);
    //     }); 
    //     // 命令行执行后保存结果
    //     if (result['status']) {
    //         const jmeterResult = new JmeterResultEntity();
    //         jmeterResult.jmeter = newJmeter;
    //         jmeterResult.md5 = newJmeter.md5;
    //         await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
    //     }
    //     return result;
    // };

    /**
     * 
     * 查询报告
     * @param md5 
     */
    async findResult(md5: string){

        const jmeterBinPath = this.config.jmeterBinPath;
        const jmeterJtlPath = this.config.jmeterJtlPath;
        const jmeterResultUrl = this.config.jmeterResultUrl;
        const jmeterHtmlPath = this.config.jmeterHtmlPath;

        if (!fs.existsSync(jmeterJtlPath+`/${md5}.jtl`)){
            throw new ApiException(`${md5}.jtl文件不存在,请确认脚本是否执行完毕。`,ApiErrorCode.JTL_FILE_UNEXIST, HttpStatus.BAD_REQUEST);
        }
        if (!fs.existsSync(jmeterHtmlPath+`/${md5}`)){
            const cmd = `${jmeterBinPath} -g ${jmeterJtlPath}/${md5}.jtl -o ${jmeterHtmlPath}/${md5}`;
            execSync(cmd);
        }
        return {url: `${jmeterResultUrl}/${md5}/index.html`};
    }


    /**
     * 查询脚本列表
     * @param name 
     * @param options 
     */
    async queryJmeterList(name: string, options: IPaginationOptions) {
        const queryBuilder = findJmeterList(this.jmeterRepository, name);
        return await paginate<JmeterEntity>(queryBuilder, options);
    }

    /**
     * 查询脚本运行结果列表
     * @param name 
     * @param options 
     */
    async queryJmeterResultList(name: string, options: IPaginationOptions) {
        const queryBuilder = findJmeterResultList(this.jmeterResultRepository, name);
        return await paginate<JmeterResultEntity>(queryBuilder, options);
    }


    /**
     * 通过jmeterId查询结果
     * @param id 
     * @param options 
     */
    async queryJmeterResultListByJmeterId(jmeterId: number, options: IPaginationOptions) {
        const queryBuilder = findJmeterResultListById(this.jmeterResultRepository, jmeterId);
        return await paginate<JmeterResultEntity>(queryBuilder, options);
    }


    /**
     * 查看jmeter执行的日志信息
     * @param md5 
     */
    async catLog(md5: string){
        const jmeterLogPath = this.config.jmeterLogPath;
        if (!fs.existsSync(`${jmeterLogPath}/${md5}.log`)) {
            throw new ApiException(`查看的log日志文件:${md5}.log 不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        return fs.readFileSync(`${jmeterLogPath}/${md5}.log`, {encoding: 'utf-8'});
    }
}


