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
    updateJmeterById
} from "../../datasource/jmeter/jmeter.sql";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {exec, fork} from 'child_process';


@Injectable()
export class JmeterService {

    config = new ConfigService(`env/${process.env.NODE_ENV}.env`);

    constructor(
        @InjectRepository(JmeterEntity)
        private readonly jmeterRepository: Repository<JmeterEntity>,
    ) {
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
        jmeterObj.md5 = crypto.createHmac("sha256", new Date() + CommonUtil.randomChar(10)).digest("hex");
        fs.copyFileSync(this.config.jmeterJmxPath+'/'+jmeterTmpObj.md5+'.jmx', this.config.jmeterJmxPath+'/'+jmeterObj.md5+'.jmx');
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
                fs.unlinkSync(path);
            }
        );
       return  await deleteJmeterByIds(this.jmeterRepository, jmeterIdsDto.ids);
    };

    async runJmeterFile(jmeterIdDto: JmeterIdDto){
        const jmeterBinPath = this.config.jmeterBinPath;
        const jmeterJtlPath = this.config.jmeterJtlPath;
        const jmeterJmxPath = this.config.jmeterJmxPath;
        const jmeterLogPath = this.config.jmeterLogPath;

        const jmeter = await findJmeterById(this.jmeterRepository, jmeterIdDto.id);
        const jmeterCountNum = jmeter.preCountNumber;
        const preCountTime = jmeter.preCountTime;
        const loopNum = jmeter.loopNum;
        const remote_address = jmeter.remote_address == null ? '' : '-R'+jmeter.remote_address;
        const cmd = `${jmeterBinPath} -n -t ${jmeterJmxPath}/${jmeter.md5}.jmx -Jconcurrent_number=${jmeterCountNum} -Jduration=${preCountTime} -Jcycles=${loopNum} -j ${jmeterLogPath}/${jmeter.md5}.log -l ${jmeterJtlPath}/${jmeter.md5}.jtl`;
    
        const child = exec(cmd, (error, stdout, stderr) => {
            if (error) {
                throw new ApiException(`${jmeter.name} => 执行压测失败`, ApiErrorCode.TIMEOUT, HttpStatus.PARTIAL_CONTENT);
            };
        });
        child.addListener('error', (messages)=>{
            console.log(messages);
        });
    };
}



