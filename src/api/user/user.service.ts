import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import {CreateUserDto, LoginUserDto, UpdateUserDto} from './dto';
const jwt = require('jsonwebtoken');
import { SECRET } from '../../config';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as crypto from 'crypto';

import { CurlService } from '../curl/curl.service';
import { ConfigService } from '../../config/config.service';
import { getRequestMethodTypeString } from '../../utils'
import { ApiException } from '../../shared/exceptions/api.exception';
import { ApiErrorCode } from '../../shared/enums/api.error.code';
import { UserData } from './user.interface';



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
    const url = this.configService.javaOapi + '/auth/open-api/autotest/useradmin/v1/login'
    const requestData = {
      url: url,
      method: getRequestMethodTypeString(1),
      data: loginUserDto
    }
    const result = await this.curlService.makeRequest(requestData).toPromise();
    if (!result.data) {
      throw new ApiException('请求失败', ApiErrorCode.TIMEOUT, HttpStatus.OK);
    }
    if (result.data.code === 10000) {
      // 请求成功储存用户
      const userData = {
        userId: result.data.data.userInfoVO.id,
        username: result.data.data.userInfoVO.username
      }
      const user = await this.saveUser(userData);
      const token = this.generateJWT(user);
      result.data.data.userInfoVO.token = token;
      return result.data.data
    } else if (result.data.code === 21010 || result.data.code === 190003) {
      return result.data.msg
    }
    else {
      throw new ApiException('请求失败', ApiErrorCode.TIMEOUT, HttpStatus.OK);
    }
  }
  
  // 保存/更新 用户
  private async saveUser(userData: UserData): Promise<UserEntity> {
    let user = await this.userRepository.findOne({userId: userData.userId});
    if (user) {
      // 用户信息不一致则更新
      if (user.username !== userData.username) {
        await this.userRepository.update(user.id, userData).catch(err => {
          throw new ApiException('更新用户失败', ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
        })
        user = Object.assign(user, userData);
      }
    } else {
      user = await this.userRepository.save(userData).catch(err => {
        throw new ApiException('保存用户失败', ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
      })
    }
    return user
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
    return user
  }

  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 7);
    return jwt.sign({
      id: user.id,
      userId: user.userId,
      username: user.username,
      exp: exp.getTime() / 1000,
    }, SECRET);
  };
}
