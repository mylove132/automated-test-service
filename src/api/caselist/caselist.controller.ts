import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {Body, Controller, Get, Optional, Post, Query} from '@nestjs/common';
import {CaselistService} from './caselist.service';
import {AddCaseListDto} from '../case/dto/case.dto';

@ApiBearerAuth()
@ApiUseTags('caseList')
@Controller('caseList')
export class CaselistController {

    constructor(private readonly caseListService: CaselistService) {}

    @ApiOperation({ title: 'query  case list' })
    @ApiResponse({ status: 200, description: 'query  case list success.'})
    @Get()
    async findCaseListById(@Query('caseListId') caseListId: string = null){
        return this.caseListService.findCaseByCaseListId(caseListId);
    }

    @ApiOperation({ title: 'add case list' })
    @ApiResponse({ status: 200, description: 'add case list success.'})
    @Post('')
    async addCaseList(@Body() addCaseListDto: AddCaseListDto) {
        return  this.caseListService.addCaseList(addCaseListDto);
    }
}
