import {Body, Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';

import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags,} from '@nestjs/swagger';
import {CaseService} from './case.service';
import {CaseType, CreateCaseDto, DeleteCaseDto, UpdateCaseDto} from './dto/case.dto';
import {OperateDesc, OperateModule, OperateType} from "../../utils/common.decorators";

@ApiBearerAuth()
@ApiUseTags('case')
@Controller('case')
export class CaseController {

  constructor(private readonly caseService: CaseService) {}



  @OperateModule('接口模块')
  @OperateType('创建接口')
  @OperateDesc('')
  @ApiOperation({ title: 'create case' })
  @ApiResponse({ status: 200, description: 'create case success.'})
  @Post()
  async createCase(@Body() createCaseDto: CreateCaseDto) {
    return this.caseService.addCase(createCaseDto);
  }

  @OperateModule('接口模块')
  @OperateType('查询接口')
  @OperateDesc('')
  @ApiOperation({ title: 'query case' })
  @ApiResponse({ status: 200, description: 'query case success.'})
  @Get()
  async findCaseById(@Query('catalogId') catalogId: number ,@Query('envId') envId: number , @Query('caseType') caseType: CaseType = CaseType.SINGLE, @Query('caseGrade') caseGrade?: string,  @Query('page') page: number = 0, @Query('limit') limit: number = 10) {
    limit = limit > 100 ? 100 : limit;
    let caseGradeList = [];
    if (caseGrade){
      if (caseGrade.indexOf(',') != -1){
        caseGrade.split(',').forEach(
            value => {
              if (!value){
                return;
              }
              caseGradeList.push(Number(value));
            }
        )
      }else {
        caseGradeList.push(Number(caseGrade));
      }
    }else {
      caseGradeList.push(0,1,2);
    }
   return this.caseService.findCase(catalogId, envId, Number(caseType), caseGradeList, {page, limit});
  }

  @OperateModule('接口模块')
  @OperateType('删除接口')
  @OperateDesc('通过ID删除接口')
  @ApiOperation({ title: 'delete case' })
  @ApiResponse({ status: 200, description: 'delete case success.'})
  @Delete('')
  async deleteCase(@Body() deleteCaseDto: DeleteCaseDto) {
    return this.caseService.deleteById(deleteCaseDto);
  }


  @OperateModule('接口模块')
  @OperateType('更新接口')
  @OperateDesc('通过ID删除接口')
  @ApiOperation({ title: 'update case' })
  @ApiResponse({ status: 200, description: 'update case success.'})
  @Put('')
  async updateCase(@Body() updateCaseDto: UpdateCaseDto) {
    return  this.caseService.updateCase(updateCaseDto);
  }

  @ApiOperation({ title: 'get all union endpoint case' })
  @ApiResponse({ status: 200, description: 'get all union endpoint success.'})
  @Get('endpoints')
  async unionFindEndpoint(){
    return this.caseService.unionFindAllEndpoint();
  }


  @ApiOperation({ title: 'get all assertType' })
  @ApiResponse({ status: 200, description: 'get all assertType success.'})
  @Get('assert-type')
  async allAssertType(){
    return this.caseService.getAllAssertType();
  }

  @ApiOperation({ title: 'get all assertType' })
  @ApiResponse({ status: 200, description: 'get all assertType success.'})
  @Get('assert-judge')
  async allAssertJudge(){
    return this.caseService.getAllAssertJudge();
  }

}
