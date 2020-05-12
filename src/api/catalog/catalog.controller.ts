import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Query } from "@nestjs/common";
import { CatalogService } from "./catalog.service";

import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { CreateCatalogDto, DeleteCatalogDto, UpdateCatalogDto } from "./dto/catalog.dto";
import { CatalogEntity } from "./catalog.entity";
import { ApiException } from "../../shared/exceptions/api.exception";
import { ApiErrorCode } from "../../shared/enums/api.error.code";
import { OpeModule, OperateDesc, OpeType } from "../../utils/common.decorators";
import { PlatformCodeEntity } from "./platformCode.entity";
import {OperateModule, OperateType} from "../../config/base.enum";


@ApiBearerAuth()
@ApiUseTags('catalogs')
@Controller('catalog')
export class CatalogController {

  constructor(private readonly catalogService: CatalogService) {}

  @OpeModule(OperateModule.CATALOG)
  @OpeType(OperateType.CREAT)
  @OperateDesc('')
  @ApiOperation({ title: 'create catalog' })
  @ApiResponse({ status: 200, description: 'create catalog success.'})
  @Post()
  async createCatalogController(@Body() createCatalogDto: CreateCatalogDto) {
    return await this.catalogService.addCatalogService(createCatalogDto);
  }


  @ApiOperation({ title: 'query catalog' })
  @ApiResponse({ status: 200, description: 'query catalog success.'})
  @Get()
  async findCatalogByPlatformCodeController(@Query('platformCode') platformCode: string): Promise<CatalogEntity[]> {
      if (platformCode == null){
          throw new ApiException("查询目录platformCode参数不能为空", ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
      }
    return this.catalogService.findCatalogService(platformCode);
  }

  @ApiOperation({ title: 'query platformCode list' })
  @ApiResponse({ status: 200, description: 'query platformCode list success.'})
  @Get('platformCodeList')
  async findPlatformCodeController(): Promise<PlatformCodeEntity[]> {
    return this.catalogService.findPlatformCodeService();
  }

  @OpeModule(OperateModule.CATALOG)
  @OpeType(OperateType.DELETE)
  @OperateDesc('')
  @ApiOperation({ title: 'delete catalog' })
  @ApiResponse({ status: 200, description: 'query catalog success.'})
  @Delete('')
  async deleteCatalogController(@Body() deleteCatalogDto: DeleteCatalogDto) {
    return this.catalogService.deleteByIdService(deleteCatalogDto);
  }

  @OpeModule(OperateModule.CATALOG)
  @OpeType(OperateType.UPDATE)
  @OperateDesc('')
  @ApiOperation({ title: 'update catalog' })
  @ApiResponse({ status: 200, description: 'update catalog success.'})
  @Put('')
  async updateCatalogController(@Body() updateCatalogDto: UpdateCatalogDto) {
    return this.catalogService.updateCatalogService(updateCatalogDto);
  }

}
