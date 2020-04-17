import {HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeleteResult, Repository} from 'typeorm';
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
import {
    deleteTokenByIds,
    findAllTokenByPlatformCodeIdAndEnvId,
    findAllTokenEnvByPlatformCodeId,
    findAllTokenPlatform,
    findTokenByEnvIdAndPlatformCode,
    findTokenById,
    findTokenByUrlAndUsername,
    findTokens,
    saveToken,
    updateToken,
    updateTokenByNewToken
} from "../../datasource/token/token.sql";
import {findEnvById} from "../../datasource/env/env.sql";
import {findPlatformCodeById} from "../../datasource/platformCode/platform.sql";
import {from} from "rxjs";
import {distinct} from "rxjs/operators";
import { CommonUtil } from "../../utils/common.util";


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
    async addTokenService(createTokenDto: CreateTokenDto) {
        const url = createTokenDto.url.charAt(createTokenDto.url.length - 1) ==
        '/' ? createTokenDto.url.substring(0, createTokenDto.url.length - 1) : createTokenDto.url;
        const tObj = await findTokenByUrlAndUsername(this.tokenRepository, url, createTokenDto.username);
        if (tObj) throw new ApiException(`url: ${createTokenDto.url} 与用户名: ${createTokenDto.username} 已存在`,
            ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        let tokenObj = new TokenEntity();
        tokenObj.username = createTokenDto.username;
        tokenObj.env = await findEnvById(this.envRepository, createTokenDto.envId);
        tokenObj.url = url;
        tokenObj.body = createTokenDto.body;
        tokenObj.platformCode = await findPlatformCodeById(this.platformRepository, createTokenDto.platformCodeId);
        CommonUtil.printLog2(JSON.stringify(tokenObj))
        const token = await this.getNewToken(tokenObj.url, tokenObj.body);
        if (!token) throw new ApiException('获取登录token失败',ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        tokenObj.token = token;
        return await saveToken(this.tokenRepository, tokenObj);
    }

    /**
     * 查询token
     * @param envId 环境ID
     * @param platformCodeId 平台code码
     * @param options
     */
    async findToken(envId: number, platformCodeId: number, options: IPaginationOptions): Promise<Pagination<TokenEntity>> {
        let queryBuilder = await findTokenByEnvIdAndPlatformCode(this.tokenRepository, envId, platformCodeId);
        return await paginate<TokenEntity>(queryBuilder, options);

    }

    /**
     * 获取所有token表中的platform（去重）
     */
    async getAllTokenOfPlatform(){
        const result = (await findAllTokenPlatform(this.tokenRepository)).map(res => {return res.platformCode});
        let rs = [];
        from(result).pipe(
            distinct((item) => item.id),
        ).subscribe(item => {
            rs.push(item);
        });
        return rs;
    }

    /**
     * 获取token中环境通过platformCodeID（去重）
     */
    async getAllTokenOfEnv(platformCodeId){
      const result = (await findAllTokenEnvByPlatformCodeId(this.tokenRepository, platformCodeId)).map(res => {return res.env});
        let rs = [];
        from(result).pipe(
            distinct((item) => item.id),
        ).subscribe(item => {
            rs.push(item);
        });
        return rs;
    }

    /**
     * 获取token中环境通过platformCodeID（去重）
     */
    async getAllTokenByEnvIdAndPlatformId(platformCodeId, envId) {
        const result = (await findAllTokenByPlatformCodeIdAndEnvId(this.tokenRepository, platformCodeId, envId)).map(res => {return {username: res.username,tokenId: res.id}});
        return result;
    }

    /**
     * 通过ID删除数据
     * @param deleteTokenDto
     */
    async deleteById(deleteTokenDto: DeleteTokenDto) {
        const result: DeleteResult = await deleteTokenByIds(this.tokenRepository, deleteTokenDto.ids);
        return result;
    }

    /**
     * 更新token数据
     * @param updateTokenDto
     */
    async updateTokenService(updateTokenDto: UpdateTokenDto) {
        const tObj = await findTokenById(this.tokenRepository, updateTokenDto.id);
        if (!tObj) throw new ApiException(`token id ${updateTokenDto.id}未找到`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        const tokenObj = new TokenEntity();
        tokenObj.platformCode = updateTokenDto.platformCodeId != null ?
            await findPlatformCodeById(this.platformRepository, updateTokenDto.platformCodeId) : tokenObj.platformCode;
        tokenObj.env = updateTokenDto.envId != null ? await findEnvById(this.envRepository, updateTokenDto.envId) :
            tokenObj.env;
        tokenObj.body = updateTokenDto.body != null ? updateTokenDto.body : tokenObj.body;
        tokenObj.username = updateTokenDto.username != null ? updateTokenDto.username : tokenObj.username;
        tokenObj.url = updateTokenDto.url != null ? updateTokenDto.url.charAt(updateTokenDto.url.length - 1) == '/' ?
            updateTokenDto.url.substring(0, updateTokenDto.url.length - 1) : updateTokenDto.url : tokenObj.url;
        tokenObj.token = await this.getNewToken(tokenObj.url, tokenObj.body);
        return await updateToken(this.tokenRepository, tokenObj, updateTokenDto.id);
    }

    /**
     *  定时更新token
     */
    @Cron('0 0 0 * * *')
    async updateTokenTask() {
        Logger.info('-----------------执行token定时更新任务----------------------');
        Logger.access('-----------------执行token定时更新任务----------------------');
        const tokenList: TokenEntity[] = await findTokens(this.tokenRepository);
        for (let tokenObj of tokenList) {
            const newToken = await this.getNewToken(tokenObj.url, tokenObj.body);
            await updateTokenByNewToken(this.tokenRepository, newToken, tokenObj.id);
            Logger.info(`token Id ${tokenObj.id} token更新完成`);
            Logger.access(`token Id ${tokenObj.id} token更新完成`);
        }
    }


    /**
     * 获取登录后的token
     * @param url
     * @param body
     * @param platformCodeId
     */
    private async getNewToken(url, body) {
        const requestData = {
            url: url,
            method: getRequestMethodTypeString(1),
            data: JSON.parse(body)
        };
        CommonUtil.printLog2('token请求体:'+JSON.stringify(requestData))
        const result = await this.curlService.makeRequest(requestData).toPromise();
        if (!result) {
            throw new ApiException(`登录URL：${url}，登录body：${body},登录失败`,
                ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        let token;
        if (result.data.code === 10000) {
            token = CommonUtil.getTokenFromResult(result.data);
        } else {
            throw new ApiException(`登录失败:code：${result.data.code}`,
                ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        console.log(token)
        return token;
    }
}
