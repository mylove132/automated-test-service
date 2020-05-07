import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {EnvEntity} from './env.entity';
import {EndpointEntity} from './endpoint.entity';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {HttpStatus} from '@nestjs/common';
import {AddEndpointDto, DeleteEndpointDto, DeleteEnvDto} from './dto/env.dto';
import {CommonUtil} from '../../utils/common.util';
import { Logger } from "../../utils/log4js";

import {
    addEnv,
    deleteEndpointByIds,
    deleteEnvByIds, findAllEndpoints,
    findAllEnv, findEndpointByEnvIds, findEndpointInstanceByEndpoint, findEndpoints,
    findEnvById, findEnvByIds, saveEndpoint,
    updateEnv,
    updateEndPoint
} from "../../datasource/env/env.sql";

export class EnvService {

    constructor(
        @InjectRepository(EnvEntity)
        private readonly envRepository: Repository<EnvEntity>,
        @InjectRepository(EndpointEntity)
        private readonly endpointgRepository: Repository<EndpointEntity>,
    ){}

    /**
     * 获取所有的环境
     */
    async allEnv(){
        return await findAllEnv(this.envRepository);
    }

    /**
     * 添加环境
     * @param env
     */
    async addEnv(env: EnvEntity){
        if (!env.name) throw new ApiException('环境名称不能为空',ApiErrorCode.ENV_NAME_INVAILD, HttpStatus.BAD_REQUEST);
        const envObj = new EnvEntity();
        envObj.name = env.name;
       return await addEnv(this.envRepository, envObj);
    }

    /**
     * 更新环境
     * @param env
     */
    async updateEnv(env: EnvEntity){
        if (!env.id) throw new ApiException('环境id不能为空',ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
        const envO = await findEnvById(this.envRepository, env.id);
        if (!envO) throw new ApiException(`更新env的ID：${env.id}不存在`,ApiErrorCode.ENV_ID_INVALID, HttpStatus.BAD_REQUEST);
        const envObj = new EnvEntity();
        envObj.id = env.id;
        envObj.name = env.name;
        return await updateEnv(this.envRepository, envObj, env.id);
    }

    async updateEndpointService(endpoint: EndpointEntity){
        return await updateEndPoint(this.endpointgRepository, endpoint);
    }

    

    /**
     * 删除环境
     * @param deleteEnvDto
     */
    async deleteEnv(deleteEnvDto: DeleteEnvDto){
        const envNames = await findEnvByIds(this.envRepository, deleteEnvDto.ids);
        Logger.info(`删除的环境名称：${envNames}`);
        return await deleteEnvByIds(this.envRepository, deleteEnvDto.ids);
    }

    /**
     * 删除endpoint
     * @param deleteEndpointDto
     */
    async deleteEndpointByIds( deleteEndpointDto: DeleteEndpointDto){
       return await deleteEndpointByIds(this.endpointgRepository, deleteEndpointDto.endpointIds);
    }

    /**
     * 添加endpoint实体
     * @param addEndpointDto
     */
    async addEndpoint(addEndpointDto: AddEndpointDto){
        const addPoint = new EndpointEntity();
        const endpoint = CommonUtil.handleUrl(addEndpointDto.endpoint);
        const endpointObj = await findEndpointInstanceByEndpoint(this.endpointgRepository, endpoint);
        if (endpointObj) throw new ApiException(`endpoint:${addEndpointDto.endpoint}已存在`,ApiErrorCode.ENDPOINT_NAME_REPEAT, HttpStatus.BAD_REQUEST);
        let envList = [];
        for (let envId of addEndpointDto.envs){
          envList.push(await findEnvById(this.envRepository, envId));
        }
       addPoint.name = addEndpointDto.name;
       addPoint.endpoint = endpoint;
       addPoint.envs = envList;
      return await saveEndpoint(this.endpointgRepository, addPoint);
    }


  /**
   * 查询所有的endpoint
   */
  async findAllEndpointService(){
      return await findAllEndpoints(this.endpointgRepository);
    }

    /**
     * 通过环境ID查询endpoint
     * @param envIds
     */
    async findEndpointByEnv(envIds){

        if (!envIds) return await findEndpoints(this.envRepository);
        let envList = [];
        envIds.indexOf(',') ? envList = envIds.split(',').map(envId => {return Number(envId)}) : envList.push(Number(envIds));

        return await findEndpointByEnvIds(this.envRepository, envList);
    }

    /**
     * 通过环境ID改变endpoint
     * @return {string}: 当前环境的endpoint
     * @param envId
     * @param endpoint
     */
    public async formatEndpoint(envId: number, endpoint: string):Promise<string> {
        const reg = new RegExp('^https:\/\/[^\S]+.[^\S\s]*blingabc.com$', 'g')
        // 如果不是blingabc的API则直接返回
        if (!reg.test(endpoint)) {
            return endpoint
        }
        let result = '';
        const envData = await findEnvById(this.envRepository, envId);
        let urlList: any = endpoint.split('.');
        // 目的分成5段 例如：['https://oapi', 'smix1', 't', 'blingabc', 'com']
        if (urlList.length == 3) { // 生产环境
            urlList.splice(1, 0, '', 't');
        } else { // 长度为4则为测试环境
            const tempList = urlList[0].split('-');
            if (tempList.length == 1) {
                urlList.splice(1, 0, '');
            } else {
                urlList[0] = urlList[0].split('-');
                // urlList = urlList.flat();
                urlList.splice(0, 1, ...urlList[0])
            }
        }
        switch(envData.name) {
            case 'test':
                urlList.splice(1, 1);
                result = urlList.join('.');
                break;
            case 'prod':
                urlList.splice(1, 2);
                result = urlList.join('.');
                break;
            default:
                result = `${urlList[0]}-${envData.name}.` + urlList.splice(2).join('.');
                break;
        }
        return result
    }
}
