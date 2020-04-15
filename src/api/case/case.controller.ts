import {Body, Controller, Delete, Get, Post, Put, Query} from "@nestjs/common";
import {ApiBearerAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {CaseService} from "./case.service";
import {CreateCaseDto, DeleteCaseDto, UpdateCaseDto} from "./dto/case.dto";
import {OpeModule, OperateDesc, OpeType} from "../../utils/common.decorators";
import {OperateModule, OperateType} from "../../config/base.enum";

@ApiBearerAuth()
@Controller('case')
export class CaseController {

    constructor(private readonly caseService: CaseService) {
    }


    @OpeModule(OperateModule.CASE)
    @OpeType(OperateType.CREAT)
    @OperateDesc('')
    @ApiOperation({title: 'create case'})
    @ApiResponse({status: 200, description: 'create case success.'})
    @Post()
    async createCase(@Body() createCaseDto: CreateCaseDto) {
        return this.caseService.addCase(createCaseDto);
    }


    @OperateDesc('')
    @ApiOperation({title: 'search case'})
    @ApiResponse({status: 200, description: 'search case success.'})
    @Get('search')
    async queryCase(@Query('name')name: string) {
        return this.caseService.searchCaseByNameService(name);
    }

    @ApiOperation({title: 'query case'})
    @ApiResponse({status: 200, description: 'query case success.'})
    @Get()
    async findCaseById(@Query('catalogId') catalogId: number, @Query('envId') envId: number,
                       @Query('caseGrade') caseGrade?: string, @Query('page') page: number = 0, @Query('limit') limit: number = 10) {
        limit = limit > 100 ? 100 : limit;
        let caseGradeList = [];
        caseGrade == null ? caseGradeList.push(0, 1, 2) : caseGrade.indexOf(',') ? caseGrade.split(',').map(grade => {
            caseGradeList.push(Number(grade))
        }) : caseGradeList.push(Number(caseGrade));
        return this.caseService.findCase(catalogId, envId, caseGradeList, {page, limit});
    }

    @OpeModule(OperateModule.CASE)
    @OpeType(OperateType.DELETE)
    @OperateDesc('')
    @ApiOperation({title: 'delete case'})
    @ApiResponse({status: 200, description: 'delete case success.'})
    @Delete('')
    async deleteCase(@Body() deleteCaseDto: DeleteCaseDto) {
        return this.caseService.deleteById(deleteCaseDto);
    }


    @OpeModule(OperateModule.CASE)
    @OpeType(OperateType.UPDATE)
    @OperateDesc('')
    @ApiOperation({title: 'update case'})
    @ApiResponse({status: 200, description: 'update case success.'})
    @Put('')
    async updateCase(@Body() updateCaseDto: UpdateCaseDto) {
        return this.caseService.updateCase(updateCaseDto);
    }

    @ApiOperation({title: 'get all union endpoint case'})
    @ApiResponse({status: 200, description: 'get all union endpoint success.'})
    @Get('endpoints')
    async unionFindEndpoint() {
        return this.caseService.unionFindAllEndpoint();
    }


    @ApiOperation({title: 'get all assertType'})
    @ApiResponse({status: 200, description: 'get all assertType success.'})
    @Get('assert-type')
    async allAssertType() {
        return this.caseService.getAllAssertType();
    }

    @ApiOperation({title: 'get all assertType'})
    @ApiResponse({status: 200, description: 'get all assertType success.'})
    @Get('assert-judge')
    async allAssertJudge() {
        return this.caseService.getAllAssertJudge();
    }

}
