import {Body, Controller, Delete, Get, HttpStatus, Post, Put, Query} from '@nestjs/common';
import {CatalogService} from './catalog.service';

import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags,} from '@nestjs/swagger';
import {CreateCatalogDto, QueryCatalogDto, UpdateCatalogDto} from './dto/catalog.dto';
import {CatalogEntity} from './catalog.entity';
import {ApiException} from "../../shared/exceptions/api.exception";
import {ApiErrorCode} from "../../shared/enums/api.error.code";


@ApiBearerAuth()
@ApiUseTags('catalogs')
@Controller('catalog')
export class CatalogController {

  constructor(private readonly catalogService: CatalogService) {}

  @ApiOperation({ title: 'create catalog' })
  @ApiResponse({ status: 200, description: 'create catalog success.'})
  @Post()
  async createCatalog(@Body() createCatalogDto: CreateCatalogDto) {
    return await this.catalogService.addCatalog(createCatalogDto);
  }

  @ApiOperation({ title: 'query catalog' })
  @ApiResponse({ status: 200, description: 'query catalog success.'})
  @Get()
  async findCatalogByPlatformCode(@Query('platformCode') platformCode: string): Promise<CatalogEntity[]> {
      if (platformCode == null){
          throw new ApiException("查询目录platformCode参数不能为空", ApiErrorCode.PARAM_VALID_FAIL, HttpStatus.BAD_REQUEST);
      }
    return this.catalogService.findCatalog(platformCode);
  }

  @ApiOperation({ title: 'delete catalog' })
  @ApiResponse({ status: 200, description: 'query catalog success.'})
  @Delete('')
  async deleteCatalog(@Body() queryCatalogDto: QueryCatalogDto) {
    return this.catalogService.deleteById(queryCatalogDto);
  }

  @ApiOperation({ title: 'update catalog' })
  @ApiResponse({ status: 200, description: 'update catalog success.'})
  @Put('')
  async updateCatalog(@Body() updateCatalogDto: UpdateCatalogDto) {
    return this.catalogService.updateCatalog(updateCatalogDto);
  }

}
