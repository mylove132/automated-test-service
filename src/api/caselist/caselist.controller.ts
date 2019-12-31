import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Optional, Post, Put, Query} from '@nestjs/common';
import {CaselistService} from './caselist.service';
import {AddCaseListDto, CaseListIdsDto, QueryCaselistDto, UpdateCaseListDto} from './dto/caselist.dto';


@ApiBearerAuth()
@ApiUseTags('caseList')
@Controller('caseList')
export class CaselistController {

    constructor(private readonly caseListService: CaselistService) {}

    @ApiOperation({ title: 'query  case list' })
    @ApiResponse({ status: 200, description: 'query  case list success.'})
    @Get()
    async findCaseListById(@Query('isTask') isTask: boolean,@Query('envId') envId:number , @Query('page') page: number = 0, @Query('limit') limit: number = 10){
        return this.caseListService.findCaseByCaseListId(isTask, envId,{page, limit});
    }

    @ApiOperation({ title: 'add case list' })
    @ApiResponse({ status: 200, description: 'add case list success.'})
    @Post('')
    async addCaseList(@Body() addCaseListDto: AddCaseListDto) {
        return  this.caseListService.addCaseList(addCaseListDto);
    }

    @ApiOperation({ title: 'update case list' })
    @ApiResponse({ status: 200, description: 'update case list success.'})
    @Put('')
    async CupdateaseList(@Body() updateCaseListDto: UpdateCaseListDto) {
        return  this.caseListService.updateCaseList(updateCaseListDto);
    }

    @ApiOperation({ title: 'delete case list' })
    @ApiResponse({ status: 200, description: 'delete case list success.'})
    @Delete('')
    async deleteByIds(@Body() caseListIdsDto: CaseListIdsDto) {
        console.log(caseListIdsDto);
        return  this.caseListService.deleteCaseList(caseListIdsDto);
    }



}
