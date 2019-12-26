import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {EnvEntity} from './env.entity';
import {EndpointEntity} from './endpoint.entity';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import {AddEndpointDto} from './dto/env.dto';

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
            throw new ApiException('环境名称不能为空',ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
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
            throw new ApiException(`更新env的ID：${env.id}不存在`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        const envObj = new EnvEntity();
        envObj.id = env.id;
        envObj.name = env.name;
        const result = await this.envRepository.createQueryBuilder().update(EnvEntity).set(envObj).where('id = :id',{id: env.id}).execute().catch(
            err => {
                throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION,HttpStatus.BAD_REQUEST);
            }
        );
        return {result: true};
    }

    async deleteEnv(ids: string){
        let delIds = [];
        if (ids.indexOf(',') != -1){
            delIds = ids.split(',');
        }else{
            delIds.push(ids);
        }
        let result = [];
        for (const delId of delIds){
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

    async deleteEndpointByIds(endpointIds: string){
        let delIds = [];
        if (endpointIds.indexOf(',') != -1){
            delIds = endpointIds.split(',');
        }else{
            delIds.push(endpointIds);
        }
        let result = [];
        for (const delId of delIds){
            const endpointObj = await this.endpointgRepository.createQueryBuilder().select().where('id = :id',{id: delId}).getOne().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION,HttpStatus.BAD_REQUEST);
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
        const addPoint = new EndpointEntity();
        if (addEndpointDto.endpoint == null){
            throw new ApiException('前缀url名称不能为空',ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        if (addEndpointDto.name == null){
            throw new ApiException('前缀名称不能为空',ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        if (addEndpointDto.envs  == null){
            throw new ApiException('环境选择不能为空',ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        }
        const envs = addEndpointDto.envs.split(',');
        let envList = [];
       for (const env of envs){
         const envObj = await this.envRepository.createQueryBuilder().select().where('id = :id',{id: Number(env)}).getOne().catch(
             err => {
                 throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.BAD_REQUEST);
             }
         );
         if (!envObj){
             throw new ApiException(`环境ID ${env}不存在`,ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
         }
         envList.push(envObj);
       }
       addPoint.name = addEndpointDto.name;
       addPoint.endpoint = addEndpointDto.endpoint;
       addPoint.envs = envList;

      return await this.endpointgRepository.save(addPoint).catch(
          err => {
              throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.BAD_REQUEST);
          }
       );
    }

    async findEndpointByEnv(envId: string){
        const result = await this.envRepository.createQueryBuilder("env").leftJoinAndSelect('env.endpoints','envpoint')
            .getMany().catch(
                err => {
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.BAD_REQUEST);
                }
            );
        if (envId == null){
            return result;
        }
        let findIds = [];
        if (envId.indexOf(',') != -1){
            findIds = envId.split(',');
        }else {
            findIds.push(envId);
        }
        for (const findId of findIds){
            const envObj = await this.envRepository.createQueryBuilder().select().where('id =  :id',{id: findId}).getOne().catch(
                err => {
                    console.log(err);
                    throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
                }
            );
            if (!envObj){
                throw new ApiException(`查询env ID:${findId}不存在`, ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.OK);
            }
        }

        let rs = [];
        for (const res of result){
            for (const findId of findIds){
                if (Number(res.id) == Number(findId)){
                    rs.push(res);
                }
            }
        }
        return rs;
    }
}
