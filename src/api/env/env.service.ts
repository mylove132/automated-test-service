import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {EnvEntity} from './env.entity';
import {EndpointEntity} from './endpoint.entity';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import {AddEndpointDto, DeleteEndpointDto, QueryEndpointDto, QueryEnvDto} from './dto/env.dto';
import {CommonUtil} from '../../util/common.util';
import { url } from 'inspector';

export class EnvService {

    constructor(
        @InjectRepository(EnvEntity)
        private readonly envRepository: Repository<EnvEntity>,
        @InjectRepository(EndpointEntity)
        private readonly endpointgRepository: Repository<EndpointEntity>,
    ){}

    async allEnv(){
        return await this.envRepository.createQueryBuilder().select().getMany().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION,HttpStatus.BAD_REQUEST);
            }
        );
    }

    async addEnv(env: EnvEntity){
        if (env.name == null){
            throw new ApiException('环境名称不能为空',ApiErrorCode.ENV_NAME_INVAILD, HttpStatus.BAD_REQUEST);
        }
        const envObj = new EnvEntity();
        envObj.name = env.name;
       const result = await this.envRepository.createQueryBuilder().insert().into(EnvEntity).values(envObj).execute().catch(
           err => {
               throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION,HttpStatus.BAD_REQUEST);
           }
       );
       return {id:result.identifiers[0].id};
    }

    async updateEnv(env: EnvEntity){
        if (env.id == null){
            throw new ApiException('环境id不能为空',ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        const envO = await this.envRepository.createQueryBuilder().select().where('id = :id', {id: env.id}).getOne().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION,HttpStatus.BAD_REQUEST);
            }
        );
        if (!envO){
            throw new ApiException(`更新env的ID：${env.id}不存在`,ApiErrorCode.ENV_ID_INVALID, HttpStatus.BAD_REQUEST);
        }
        const envObj = new EnvEntity();
        envObj.id = env.id;
        envObj.name = env.name;
        const result = await this.envRepository.createQueryBuilder().update(EnvEntity).set(envObj).where('id = :id',{id: env.id}).execute().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.BAD_REQUEST);
            }
        );
        return {result: true};
    }

    async deleteEnv(queryEnvDto: QueryEnvDto){
        queryEnvDto.ids.forEach(
            id => {
                if (!CommonUtil.isNumber(id)){
                    throw new ApiException(`数组值${id}必须为数字`, ApiErrorCode.PARAM_VALID_FAIL,HttpStatus.BAD_REQUEST);
                }
            }
        );
        let result = [];
        for (const delId of queryEnvDto.ids){
            const envObj = await this.envRepository.createQueryBuilder().select().where('id = :id',{id: delId}).getOne().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION,HttpStatus.BAD_REQUEST);
                }
            );
            if (!envObj){
                const res = {"id": delId,status: false,message: "id不存在"};
                result.push(res);
                continue;
            }else {
                await this.envRepository.createQueryBuilder().delete().where('id = :id',{id: delId}).execute().catch(
                    err => {
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION,HttpStatus.BAD_REQUEST);
                    }
                );
                const res = {"id": delId,status: true}
                result.push(res);
            }
        }
        return result;
    }

    async deleteEndpointByIds( deleteEndpointDto: DeleteEndpointDto){

        deleteEndpointDto.endpointIds.forEach(
            id => {
                if (!CommonUtil.isNumber(id)){
                    throw new ApiException(`数组值${id}必须为数字`, ApiErrorCode.PARAM_VALID_FAIL,HttpStatus.BAD_REQUEST);
                }
            }
        );

        let result = [];
        for (const delId of deleteEndpointDto.endpointIds){
            const endpointObj = await this.endpointgRepository.createQueryBuilder().select().where('id = :id',{id: delId}).getOne().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.BAD_REQUEST);
                }
            );
            if (!endpointObj){
                const res = {"id": delId,status: false,message: "id不存在"};
                result.push(res);
                continue;
            }else {
                await this.endpointgRepository.createQueryBuilder().delete().where('id = :id',{id: delId}).execute().catch(
                    err => {
                        throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION,HttpStatus.BAD_REQUEST);
                    }
                );
                const res = {"id": delId,status: true}
                result.push(res);
            }
        }
        return result;
    }

    async addEndpoint(addEndpointDto: AddEndpointDto){
        console.log(addEndpointDto);
        const addPoint = new EndpointEntity();
        if (addEndpointDto.endpoint == null){
            throw new ApiException('前缀url名称不能为空', ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }else {
            const endpointObj = await this.endpointgRepository.createQueryBuilder().select().where('endpoint = :endpoint',{endpoint: addEndpointDto.endpoint}).getOne().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION,HttpStatus.BAD_REQUEST);
                }
            );
            if (endpointObj){
                throw new ApiException(`endpoint:${addEndpointDto.endpoint}已存在`,ApiErrorCode.ENDPOINT_NAME_REPEAT, HttpStatus.BAD_REQUEST);
            }
        }
        if (addEndpointDto.name == null){
            throw new ApiException('前缀名称不能为空',ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        let envList = [];
       for (const env of addEndpointDto.envs){
         const envObj = await this.envRepository.findOne(env).catch(
             err => {
                 throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.BAD_REQUEST);
             }
         );
         if (!envObj){
             throw new ApiException(`环境ID ${env}不存在`,ApiErrorCode.ENV_ID_INVALID, HttpStatus.BAD_REQUEST);
         }
         envList.push(envObj);
       }
       let endP;
       if (addEndpointDto.endpoint.lastIndexOf('/')){
           endP = addEndpointDto.endpoint.substr(0,addEndpointDto.endpoint.length-1);
       }else {
           endP = addEndpointDto.endpoint;
       }
       addPoint.name = addEndpointDto.name;
       addPoint.endpoint = endP;
       addPoint.envs = envList;

      return await this.endpointgRepository.save(addPoint).catch(
          err => {
              throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.BAD_REQUEST);
          }
       );
    }

    async findEndpointByEnv(envIds){
        const result = await this.envRepository.createQueryBuilder("env").leftJoinAndSelect('env.endpoints','envpoint')
            .getMany().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.BAD_REQUEST);
                }
            );
        if (envIds == 'undefined'){
            return result;
        }
        envIds = envIds.split(',');
        envIds.forEach(
            id => {
                if (!CommonUtil.isNumber(id)){
                    throw new ApiException(`数组值${id}必须为数字`, ApiErrorCode.PARAM_VALID_FAIL,HttpStatus.BAD_REQUEST);
                }
            }
        );
        for (const findId of envIds){
            const envObj = await this.envRepository.createQueryBuilder().select().where('id =  :id',{id: findId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!envObj){
                throw new ApiException(`查询env ID:${findId}不存在`, ApiErrorCode.ENV_ID_INVALID, HttpStatus.OK);
            }
        }

        let rs = [];
        for (const res of result){
            for (const findId of envIds){
                if (Number(res.id) == findId){
                    rs.push(res);
                }
            }
        }
        return rs;
    }

    /**
     * 通过环境ID改变endpoint
	 * @param {number, string}
	 * @return {string}: 当前环境的endpoint
     */
    public async formatEndpoint(envId: number, endpoint: string):Promise<string> {
        const reg = new RegExp('^https:\/\/[^\S]+.[^\S\s]*blingabc.com$', 'g')
        // 如果不是blingabc的API则直接返回
        if (!reg.test(endpoint)) {
            return endpoint
        }
        let result = ''
        const envData = await this.envRepository.createQueryBuilder()
        .select()
        .where('id = :id',{id: envId})
        .getOne()
        .catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION,HttpStatus.BAD_REQUEST);
            }
        );
        
        let urlList: any = endpoint.split('.');

        // 目的分成5段 例如：['https://oapi', 'smix1', 't', 'blingabc', 'com']
        if (urlList.length == 3) { // 生产环境
            urlList.splice(1, 0, '', 't');
        } else { // 长度为4则为测试环境
            const tempList = urlList[0].split('-')
            if (tempList.length == 1) {
                urlList.splice(1, 0, '');
            } else {
                urlList[0] = urlList[0].split('-')
                // urlList = urlList.flat();
                urlList.splice(0, 1, ...urlList[0])
            }
        }
        switch(envData.name) {
            case 'test':
                urlList.splice(1, 1)
                result = urlList.join('.')
                break;
            case 'prod':
                urlList.splice(1, 2)
                result = urlList.join('.')
                break;
            default:
                result = `${urlList[0]}-${envData.name}.` + urlList.splice(2).join('.')
                break;
        }
        return result
    }
}
