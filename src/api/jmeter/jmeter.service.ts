import {InjectRepository} from '@nestjs/typeorm';
import {UserEntity} from '../user/user.entity';
import { Repository} from 'typeorm';
import {CatalogEntity} from './catalog.entity';
import {CreateCatalogDto, QueryCatalogDto, UpdateCatalogDto} from './dto/catalog.dto';
import {HttpStatus} from '@nestjs/common';
import {ApiException} from '../../shared/exceptions/api.exception';
import {ApiErrorCode} from '../../shared/enums/api.error.code';
import {CommonUtil} from '../../util/common.util';
import {PlatformCodeEntity} from "./platformCode.entity";

export class JmeterService {
    constructor(
        @InjectRepository(PlatformCodeEntity)
        private readonly platformRepository: Repository<PlatformCodeEntity>,
        @InjectRepository(CatalogEntity)
        private readonly catalogRepository: Repository<CatalogEntity>
    ) {
    }

    async uploadJmeterFile(){

    }
}
