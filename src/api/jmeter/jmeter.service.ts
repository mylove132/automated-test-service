import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import {JmeterEntity} from "./jmeter.entity";

@Injectable()
export class JmeterService {
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
}
