import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import {CreateUserDto, LoginUserDto, UpdateUserDto} from './dto';
const jwt = require('jsonwebtoken');
import { SECRET } from '../../config';
import { UserRO } from './user.interface';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';

import { CurlService } from '../curl/curl.service';
import { ConfigService } from '../../config/config.service';
import { getRequestMethodTypeString } from '../../utils'
import { ApiException } from '../../shared/exceptions/api.exception';
import { ApiErrorCode } from '../../shared/enums/api.error.code';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private curlService: CurlService,
    private configService: ConfigService,
  ) {}
  
  /**
   * 登录接口
   * @param {LoginUserDto}: 用户名及密码
   * @return {Promise<any>}: 返回的用户信息及菜单列表
   */
  async login(loginUserDto: LoginUserDto): Promise<any> {
    const url = this.configService.javaOapi + '/open-api/autotest/useradmin/v1/login'
    const requestData = {
      url: url,
      method: getRequestMethodTypeString(1),
      data: loginUserDto
    }
    const result = await this.curlService.makeRequest(requestData).toPromise();
    if (result.data.code === 10000) {
      // 请求成功储存用户

    } else if (result.data.code === 21010) {
      return result.data.msg
    } else {
      throw new ApiException('请求失败', ApiErrorCode.TIMEOUT, HttpStatus.OK);
    }
    return result
  }

  /**
   * 通过id查询用户
   * @param {number}: id
   * @return {Promise<UserRO>}: 用户信息
   */
  async findById(id: number): Promise<any>{
    const user = await this.userRepository.findOne(id);
    if (!user) {
      const errors = {User: ' not found'};
      throw new HttpException({errors}, 401);
    };
    return this.buildUserRO(user);
  }

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      exp: exp.getTime() / 1000,
    }, SECRET);
  };

  private buildUserRO(user: UserEntity) {
    const userRO = {
      username: user.username,
      token: this.generateJWT(user),
    };

    return {user: userRO};
  }
}
