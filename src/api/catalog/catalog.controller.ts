import {Get, Post, Body, Put, Delete, Query, Param, Controller, UsePipes} from '@nestjs/common';
import { CatalogService } from './catalog.service';


import {
  ApiUseTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {CreateCatalogDto} from "./dto/create-catalog.dto";
import {ValidationPipe} from "../../shared/pipes/validation.pipe";
import {CatalogEntity} from "./catalog.entity";

@ApiBearerAuth()
@ApiUseTags('catalogs')
@Controller('catalog')
export class CatalogController {

  constructor(private readonly catalogService: CatalogService) {}

  @ApiOperation({ title: 'create catalog' })
  @ApiResponse({ status: 200, description: 'create catalog success.'})
  @UsePipes(new ValidationPipe())
  @Post()
  async createCatalog(@Body() createCatalogDto: CreateCatalogDto) {
    return await this.catalogService.addCatalog(createCatalogDto);
  }

  @ApiOperation({ title: 'create catalog' })
  @ApiResponse({ status: 200, description: 'create catalog success.'})
  @Get()
  async findCatalogById() {
    return this.catalogService.findCatalogByUserId();
  }

}
