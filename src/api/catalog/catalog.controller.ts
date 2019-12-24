import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put} from '@nestjs/common';
import {CatalogService} from './catalog.service';

import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags,} from '@nestjs/swagger';
import {CreateCatalogDto, DeleteCatalogDto, QueryCatalogDto, UpdateCatalogDto} from './dto/catalog.dto';
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
  async findCatalogById(@Body() queryCatalogDto: QueryCatalogDto): Promise<CatalogEntity[]> {
    return this.catalogService.findCatalog(queryCatalogDto);
  }

  @ApiOperation({ title: 'delete catalog' })
  @ApiResponse({ status: 200, description: 'query catalog success.'})
  @Delete(':ids')
  async deleteCatalog(@Param('ids') ids: string) {
    console.log(ids)
    return this.catalogService.deleteById(ids);
  }

  @ApiOperation({ title: 'update catalog' })
  @ApiResponse({ status: 200, description: 'update catalog success.'})
  @Put('')
  async updateCatalog(@Body() updateCatalogDto: UpdateCatalogDto) {
    return this.catalogService.updateCatalog(updateCatalogDto);
  }

}
