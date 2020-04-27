import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as fs from 'fs';
import {ConfigService} from "../../config/config.service";
import {IPaginationOptions, Pagination} from 'nestjs-typeorm-paginate';
import {JmeterEntity} from "./jmeter.entity";
import * as crypto from "crypto";
import {CommonUtil} from "../../utils/common.util";
import {CreateJmeterDto, DeleteJmeterDto, UpdateJmeterDto} from "./dto/jmeter.dto";
import {createJmeter, findJmeterById, findJmeterByMd5, updateJmeterById} from "../../datasource/jmeter/jmeter.sql";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";

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
  async uploadFile(file){
    const fileName = file.originalname;
    const md5 = crypto.createHmac("sha256", new Date() + CommonUtil.randomChar(10)).digest("hex");
    fs.writeFileSync(this.config.jmeterJmxPath + `/${md5}.jmx`,file.buffer);
    return {
      fileName: fileName,
      md5: md5
    }
  }


  /**
   * 创建压测信息
   * @param createJmeterDto
   */
  async createJmeterInfo (createJmeterDto: CreateJmeterDto){
    let fileList = fs.readdirSync(this.config.jmeterJmxPath );
    fileList = fileList.map( file => {return file.split('.')[0]});
    if (fileList.indexOf(createJmeterDto.md5) == -1){
      throw new ApiException(`md5值：${createJmeterDto.md5}文件不存在`,
          ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.PARTIAL_CONTENT);
    }
    const jmeterObj = await findJmeterByMd5(this.jmeterRepository, createJmeterDto.md5);
    if (jmeterObj) throw new ApiException(`md5值：${createJmeterDto.md5}已存在`,
        ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
    return  await createJmeter(this.jmeterRepository, createJmeterDto);
  }


    /**
     * 更新jmeter信息
     * @param updateJmeterDto
     */
  async updateJmeterInfo (updateJmeterDto: UpdateJmeterDto){

    const jmeterTmpObj = await findJmeterById(this.jmeterRepository, updateJmeterDto.id);
    if (!jmeterTmpObj) throw new ApiException(`ID为:${updateJmeterDto.id}的jmeter数据不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.PARTIAL_CONTENT);

    let jmeterObj = new JmeterEntity();
    if (updateJmeterDto.loopNum != null) jmeterObj.loopNum = updateJmeterDto.loopNum ;
    if (updateJmeterDto.preCountNumber != null) jmeterObj.preCountNumber = updateJmeterDto.preCountNumber ;
    if (updateJmeterDto.preCountTime != null) jmeterObj.preCountTime = updateJmeterDto.preCountTime ;
    if (updateJmeterDto.name != null) jmeterObj.name = updateJmeterDto.name ;

    return await updateJmeterById(this.jmeterRepository, updateJmeterDto, updateJmeterDto.id);
  }

    /**
     * 删除jmeter信息
     * @param deleteJmeterDto
     */
  async deleteJmeterInfo (deleteJmeterDto: DeleteJmeterDto) {

  }
}



