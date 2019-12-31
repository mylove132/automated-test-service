import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query} from '@nestjs/common';
import {CatalogService} from './catalog.service';

import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags,} from '@nestjs/swagger';
import {CreateCatalogDto, QueryCatalogDto, UpdateCatalogDto} from './dto/catalog.dto';
import {CatalogEntity} from './catalog.entity';


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
  async findCatalogById(@Query('userId') userId: number, @Query('isPub') isPub: boolean): Promise<CatalogEntity[]> {
    return this.catalogService.findCatalog(userId, isPub);
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
