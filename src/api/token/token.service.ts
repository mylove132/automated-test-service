import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {InsertResult, Repository} from 'typeorm';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {TokenEntity} from "./token.entity";
import {CreateTokenDto, TokenPlatform} from "./dto/token.dto";
import {getRequestMethodTypeString} from "../../utils";
import {CurlService} from "../curl/curl.service";
import {EnvEntity} from "../env/env.entity";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";



@Injectable()
export class TokenService {
  constructor(
      private curlService: CurlService,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
      @InjectRepository(EnvEntity)
      private readonly envRepository: Repository<EnvEntity>
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
      tokenObj.tokenPlatform = createTokenDto.tokenPlatform;
        const requestData = {
            url: createTokenDto.url,
            method: getRequestMethodTypeString(1),
            data: JSON.parse(createTokenDto.body)
        };
        console.log(requestData)
        const result = await this.curlService.makeRequest(requestData).toPromise();
        if (!result){
            throw new ApiException(`登录URL：${createTokenDto.url}，登录body：${createTokenDto.body},登录失败`,
                ApiErrorCode.PARAM_VALID_FAIL,HttpStatus.BAD_REQUEST);
        }
        let token;
        if (result.data.code === 10000){
            switch (createTokenDto.tokenPlatform) {
                case TokenPlatform.CRM:
                    token = result.data.data.userInfoVO.token;
                    break;
                case TokenPlatform.SALE:
                    token = result.data.data.userInfo.token;
                    break;
            }
        } else {
            throw new ApiException(`登录失败:code：${result.data.code}`,
                ApiErrorCode.PARAM_VALID_FAIL,HttpStatus.BAD_REQUEST);
        }
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

    async findCase(envId: number, tokenPlatform: TokenPlatform, options: IPaginationOptions): Promise<Pagination<TokenEntity>> {

      let queryBuilder;
      if (envId && tokenPlatform){
          queryBuilder = this.tokenRepository.createQueryBuilder('token').
          where('token.env = :env', {env: envId}).
          andWhere('token.tokenPlatform = :tokenPlatform',{tokenPlatform : tokenPlatform}).
          orderBy('token.updateDate', 'DESC');
      }else if (envId &&!tokenPlatform){
          queryBuilder = this.tokenRepository.createQueryBuilder('token').
          where('token.env = :env', {env: envId}).
          orderBy('token.updateDate', 'DESC');
      } else  if (!envId && tokenPlatform){
          queryBuilder = this.tokenRepository.createQueryBuilder('token').
          where('token.tokenPlatform = :tokenPlatform',{tokenPlatform : tokenPlatform}).
          orderBy('token.updateDate', 'DESC');
      }else  if (!envId && !tokenPlatform){
          queryBuilder = this.tokenRepository.createQueryBuilder('token').
          orderBy('token.updateDate', 'DESC');
      }
      const result = await paginate<TokenEntity>(queryBuilder, options);
      return result;

  }

}
