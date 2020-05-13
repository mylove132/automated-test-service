import {Body, Controller, Delete, Get, Post, Put, Query, SetMetadata} from "@nestjs/common";
import {ApiBearerAuth, ApiOperation, ApiResponse} from "@nestjs/swagger";
import {CaseService} from "./case.service";
import {BatchUpdateCatalogDto, CreateCaseDto, DeleteCaseDto, UpdateCaseDto} from "./dto/case.dto";
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
    async createCaseController(@Body() createCaseDto: CreateCaseDto) {
        return this.caseService.addCaseService(createCaseDto);
    }


    @OperateDesc('')
    @ApiOperation({title: 'search case'})
    @ApiResponse({status: 200, description: 'search case success.'})
    @Get('search')
    async queryCaseController(@Query('name')name: string) {
        return this.caseService.searchCaseByNameService(name);
    }

    @OperateDesc('')
    @ApiOperation({title: 'query count number case'})
    @ApiResponse({status: 200, description: 'query count number success.'})
    @Get('count')
    @SetMetadata('isOpen', true)
    async queryCaseCountNumberController() {
        return this.caseService.getAllCaseCountService();
    }


    @ApiOperation({title: 'query case'})
    @ApiResponse({status: 200, description: 'query case success.'})
    @Get()
    async findCaseByIdController(@Query('catalogId') catalogId: number, @Query('envId') envId: number,
                       @Query('caseGrade') caseGrade?: string, @Query('page') page: number = 0, @Query('limit') limit: number = 10) {
        limit = limit > 100 ? 100 : limit;
        let caseGradeList = [];
        caseGrade == null ? caseGradeList.push(0, 1, 2) : caseGrade.indexOf(',') ? caseGrade.split(',').map(grade => {
            caseGradeList.push(Number(grade))
        }) : caseGradeList.push(Number(caseGrade));
        return this.caseService.findCaseService(catalogId, envId, caseGradeList, {page, limit});
    }

    @OpeModule(OperateModule.CASE)
    @OpeType(OperateType.DELETE)
    @OperateDesc('')
    @ApiOperation({title: 'delete case'})
    @ApiResponse({status: 200, description: 'delete case success.'})
    @Delete('')
    async deleteCaseController(@Body() deleteCaseDto: DeleteCaseDto) {
        return this.caseService.deleteByIdService(deleteCaseDto);
    }


    @OpeModule(OperateModule.CASE)
    @OpeType(OperateType.UPDATE)
    @OperateDesc('')
    @ApiOperation({title: 'update case'})
    @ApiResponse({status: 200, description: 'update case success.'})
    @Put('')
    async updateCaseController(@Body() updateCaseDto: UpdateCaseDto) {
        return this.caseService.updateCaseService(updateCaseDto);
    }

    @ApiOperation({title: 'batch update case'})
    @ApiResponse({status: 200, description: 'batch update case success.'})
    @Put('batchUpdate')
    async batchUpdateController(@Body() batchUpdateCatalogDto: BatchUpdateCatalogDto) {
        return this.caseService.batchUpdateCatalogService(batchUpdateCatalogDto);
    }

    @ApiOperation({title: 'get all union endpoint case'})
    @ApiResponse({status: 200, description: 'get all union endpoint success.'})
    @Get('endpoints')
    async unionFindEndpointController() {
        return this.caseService.unionFindAllEndpointService();
    }


    @ApiOperation({title: 'get all assertType'})
    @ApiResponse({status: 200, description: 'get all assertType success.'})
    @Get('assert-type')
    async allAssertType() {
        return this.caseService.getAllAssertTypeService();
    }

    @ApiOperation({title: 'get all assertType'})
    @ApiResponse({status: 200, description: 'get all assertType success.'})
    @Get('assert-judge')
    async allAssertJudge() {
        return this.caseService.getAllAssertJudgeService();
    }



}
