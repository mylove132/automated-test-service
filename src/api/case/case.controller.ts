import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';

import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags,} from '@nestjs/swagger';
import {CaseService} from './case.service';
import {AddCaseListDto, CreateCaseDto, UpdateCaseDto} from './dto/case.dto';
import {IsNotEmpty} from 'class-validator';


@ApiBearerAuth()
@ApiUseTags('case')
@Controller('case')
export class CaseController {

  constructor(private readonly caseService: CaseService) {}

  @ApiOperation({ title: 'create case' })
  @ApiResponse({ status: 200, description: 'create case success.'})
  @Post()
  async createCase(@Body() createCaseDto: CreateCaseDto) {
    return this.caseService.addCase(createCaseDto);
  }

  @ApiOperation({ title: 'query case' })
  @ApiResponse({ status: 200, description: 'query case success.'})
  @Get()
  async findCaseById(@Query('catalogId') catalogId: number ,@Query('page') page: number = 0, @Query('limit') limit: number = 10) {
    limit = limit > 100 ? 100 : limit;
   return this.caseService.findCase(catalogId,{page, limit});
  }

  @ApiOperation({ title: 'delete case' })
  @ApiResponse({ status: 200, description: 'query case success.'})
  @Delete(':ids')
  async deleteCase(@Param('ids') ids: string) {
    return this.caseService.deleteById(ids);
  }


  @ApiOperation({ title: 'update case' })
  @ApiResponse({ status: 200, description: 'update case success.'})
  @Put('')
  async updateCase(@Body() updateCaseDto: UpdateCaseDto) {
    return  this.caseService.updateCase(updateCaseDto);
  }


}
