import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeleteResult, InsertResult, Repository, UpdateResult} from 'typeorm';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {TokenEntity} from "./token.entity";
import {CreateTokenDto, DeleteTokenDto, UpdateTokenDto} from "./dto/token.dto";
import {getRequestMethodTypeString} from "../../utils";
import {CurlService} from "../curl/curl.service";
import {EnvEntity} from "../env/env.entity";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import {PlatformCodeEntity} from "../catalog/platformCode.entity";
import {Logger} from "../../utils/log4js";
import {Cron} from "@nestjs/schedule";


@Injectable()
export class TokenService {
  constructor(
      private curlService: CurlService,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
      @InjectRepository(EnvEntity)
      private readonly envRepository: Repository<EnvEntity>,
      @InjectRepository(PlatformCodeEntity)
      private readonly platformRepository: Repository<PlatformCodeEntity>
  ) {
  }

    /**
     * 分页信息
     * @param options
     */
    async paginate(options: IPaginationOptions): Promise<Pagination<TokenEntity>> {
        return await paginate<TokenEntity>(this.tokenRepository, options);
    }

    /**
     * 添加token
     * @param createTokenDto
     */
  async addTokenService(createTokenDto: CreateTokenDto){
      let url = createTokenDto.url;
      if(createTokenDto.url.charAt(createTokenDto.url.length - 1) == "/"){
          url = createTokenDto.url.substring(0, createTokenDto.url.length - 1);
      }

      const tObj = await this.tokenRepository.createQueryBuilder('token').select().
      where('token.url = :url',{url: url}).
      andWhere('token.username = :username',{username: createTokenDto.username}).getOne().catch(
          err => {
              throw new ApiException(`查询环境ID ${createTokenDto.envId}失败`, ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
          }
      );

      if (tObj){
          throw new ApiException(`url: ${createTokenDto.url} 与用户名: ${createTokenDto.username} 已存在`,
              ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
      }

      let tokenObj = new TokenEntity();
      tokenObj.username = createTokenDto.username;
      tokenObj.env = await this.envRepository.findOne(createTokenDto.envId).catch(
          err => {
              throw new ApiException(`查询环境ID ${createTokenDto.envId}失败`, ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
          }
      );
      tokenObj.url = url;
      tokenObj.body = createTokenDto.body;
      tokenObj.platformCode = await this.platformRepository.createQueryBuilder('platform').where(
          'platform.platformCode = :platformCode',{platformCode: createTokenDto.platformCode}
      ).getOne();
        const token = await this.getNewToken(tokenObj.url, tokenObj.body, tokenObj.platformCode.id);
        tokenObj.token = token;
        const saveResult:InsertResult = await this.tokenRepository.createQueryBuilder().
        insert().into(TokenEntity).values(tokenObj).execute().catch(
            err => {
                throw new ApiException('保存token失败', ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
            }
        );
        const addId = saveResult.identifiers[0].id;
        return {"id": addId};
  }

    /**
     * 查询token
     * @param envId 环境ID
     * @param platformCode 平台code码
     * @param options
     */
    async findCase(envId: number, platformCode: string, options: IPaginationOptions): Promise<Pagination<TokenEntity>> {
      let queryBuilder;
      if (envId && platformCode){
          const platformCodeObj = await this.platformRepository.createQueryBuilder('platform').
          where('platform.platformCode = :platformCode',{platformCode: platformCode}).getOne();
          queryBuilder = this.tokenRepository.createQueryBuilder('token').
          where('token.env = :env', {env: envId}).
          andWhere('token.platformCode = :platformCode',{platformCode : platformCodeObj.id}).
          orderBy('token.updateDate', 'DESC');
      }else if (envId &&!platformCode){
          queryBuilder = this.tokenRepository.createQueryBuilder('token').
          where('token.env = :env', {env: envId}).
          orderBy('token.updateDate', 'DESC');
      } else  if (!envId && platformCode){
          const platformCodeObj = await this.platformRepository.createQueryBuilder('platform').
          where('platform.platformCode = :platformCode',{platformCode: platformCode}).getOne();
          queryBuilder = this.tokenRepository.createQueryBuilder('token').
          where('token.platformCode = :platformCode',{platformCode : platformCodeObj.id}).
          orderBy('token.updateDate', 'DESC');
      }else  if (!envId && !platformCode){
          queryBuilder = this.tokenRepository.createQueryBuilder('token').
          orderBy('token.updateDate', 'DESC');
      }
      const result = await paginate<TokenEntity>(queryBuilder, options);
      return result;

  }

    /**
     * 通过ID删除数据
     * @param deleteTokenDto
     */
  async deleteById(deleteTokenDto: DeleteTokenDto){
      const result: DeleteResult = await this.tokenRepository.createQueryBuilder('token').delete().where(
          'token.id IN (:...tokenIds)',{tokenIds: deleteTokenDto.ids}
      ).execute().catch(
          err => {
              throw new ApiException('保存token失败', ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
          }
      )
      console.log(result);
     return  result;
  }

    /**
     * 更新token数据
     * @param updateTokenDto
     */
  async updateTokenService(updateTokenDto: UpdateTokenDto){
        const tokenObj = await this.tokenRepository.findOne(updateTokenDto.id).catch(
          err => {
              throw new ApiException('保存token失败', ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
          }
      )
      if(!tokenObj){
          throw new ApiException(`token id ${updateTokenDto.id}未找到`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
      }
      tokenObj.platformCode = updateTokenDto.platformCode != null ? await this.platformRepository.
      createQueryBuilder('platform').
      where('platform.platformCode = :platformCode',{platformCode: updateTokenDto.platformCode}).getOne() :
          tokenObj.platformCode;
      tokenObj.env = updateTokenDto.envId != null ? await this.envRepository.findOne(updateTokenDto.envId):
          tokenObj.env;
      tokenObj.body = updateTokenDto.body != null ? updateTokenDto.body : tokenObj.body;
      tokenObj.username = updateTokenDto.username != null ? updateTokenDto.username : tokenObj.username;
      tokenObj.token = updateTokenDto.token != null ? updateTokenDto.token : tokenObj.token;
        let url = updateTokenDto.url == null ? tokenObj.url : updateTokenDto.url;
        if(url.charAt(url.length - 1) == "/"){
            url = url.substring(0, url.length - 1);
        }
        tokenObj.url = url;

        const tObj = await this.tokenRepository.createQueryBuilder('token').select().
        where('token.url = :url',{url: tokenObj.url}).
        andWhere('token.username = :username',{username: tokenObj.username}).getOne().catch(
            err => {
                throw new ApiException('保存token失败', ApiErrorCode.CREATE_USER_FAIL, HttpStatus.OK);
            }
        );
        if (tObj){
            throw new ApiException(`url: ${tokenObj.url} 与用户名: ${tokenObj.username} 已存在`,
                ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
      const result: UpdateResult = await this.tokenRepository.createQueryBuilder().update(TokenEntity).set({
          "platformCode": tokenObj.platformCode,
          "env": tokenObj.env,
          "body": tokenObj.body,
          "username": tokenObj.username,
          "token": tokenObj.token,
          "url": tokenObj.url
      }).
      where('id = :id', {id: updateTokenDto.id}).execute().catch(
          err => {
              console.log(err);
              throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
          }
      );
      if (result.affected == 1){
          return {status: true};
      }else {
          return {status: false};
      }
  }

    /**
     *  定时更新token
     */
    @Cron('0 0 0 * * *')
    async updateTokenTask(){
        Logger.info('-----------------执行token定时更新任务----------------------');
        Logger.access('-----------------执行token定时更新任务----------------------');
        const tokenList: TokenEntity[] = await this.tokenRepository.createQueryBuilder('token').
        leftJoinAndSelect('token.platformCode','platformCode').getMany().catch(
            err => {
                console.log(err);
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
            }
        );
        for (let tokenObj of tokenList){
            const newToken = await this.getNewToken(tokenObj.url, tokenObj.body, tokenObj.platformCode.id);
            await this.tokenRepository.createQueryBuilder().update(TokenEntity).set(
                {token: newToken}
            ).where('id = :id',{id: tokenObj.id}).execute().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            Logger.info(`token Id ${tokenObj.id} token更新完成`);
            Logger.access(`token Id ${tokenObj.id} token更新完成`);
        }
    }

    private async getNewToken(url, body, platformCodeId){
        const requestData = {
            url: url,
            method: getRequestMethodTypeString(1),
            data: JSON.parse(body)
        };
        console.log(requestData)
        const result = await this.curlService.makeRequest(requestData).toPromise();
        if (!result){
            throw new ApiException(`登录URL：${url}，登录body：${body},登录失败`,
                ApiErrorCode.PARAM_VALID_FAIL,HttpStatus.BAD_REQUEST);
        }
        let token;
        if (result.data.code === 10000){
            switch (platformCodeId) {
                case 1:
                    token = result.data.data.userInfoVO.token;
                    break;
                case 2:
                    token = result.data.data.userInfo.token;
                    break;
                case 3:
                    token = result.data.data.userInfo.token;
                    break;
                case 4:
                    token = result.data.data.userInfoVO.token;
                    break;
            }
        } else {
            throw new ApiException(`登录失败:code：${result.data.code}`,
                ApiErrorCode.PARAM_VALID_FAIL,HttpStatus.BAD_REQUEST);
        }
        return token;
    }
}
