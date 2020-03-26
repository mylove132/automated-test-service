import {Repository} from "typeorm";
import {CatalogEntity} from "../../api/catalog/catalog.entity";
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";
import {HttpStatus} from "@nestjs/common";

export const findCatalogById = async (catalogEntityRepository: Repository<CatalogEntity>, id) => {
    return await catalogEntityRepository.findOne(id).catch(
        err => {
            console.log(err);
            throw new ApiException(err, ApiErrorCode.RUN_SQL_EXCEPTION, HttpStatus.OK);
        }
    )
}
