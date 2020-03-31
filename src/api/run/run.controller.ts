import {Controller, Post, Body, Query, Get} from '@nestjs/common';
import {RunService} from './run.service';
import {RunCaseDto, RunCaseByIdDto, RunCaseListByIdDto, CovertDto, RunSceneDto} from './dto/run.dto';
import {ApiOperation, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {OperateDesc, OperateModule, OperateType} from "../../utils/common.decorators";

@ApiUseTags('run')
@Controller('run')
export class RunController {
    constructor(
        private runService: RunService,
    ) {
    }

    @OperateModule('运行模块')
    @OperateType('执行临时接口')
    @OperateDesc('')
    @ApiOperation({title: 'run temp case', description: '运行http请求'})
    @ApiResponse({status: 200, description: 'run temp case success.'})
    @Post('script')
    async runTempCase(@Body() runCaseDto: RunCaseDto): Promise<any> {
        return await this.runService.runTempCase(runCaseDto);
    }

    @OperateModule('运行模块')
    @OperateType('通过接口ID运行')
    @OperateDesc('')
    @ApiOperation({title: 'run case by id', description: '运行某具体样例请求'})
    @ApiResponse({status: 200, description: 'run case success.'})
    @Post('case-script')
    async runCaseById(@Body() runCaseByIdDto: RunCaseByIdDto): Promise<any> {
        return await this.runService.runCaseById(runCaseByIdDto);
    }

    @OperateModule('运行模块')
    @OperateType('执行临时接口')
    @OperateDesc('')
    @ApiOperation({title: 'run caselist by id', description: '运行样例里的所有接口请求'})
    @ApiResponse({status: 200, description: 'run caselist success.'})
    @Post('caselist-script')
    async runCaseListById(@Body() runCaseListByIdDto: RunCaseListByIdDto): Promise<any> {
        return await this.runService.runCaseListById(runCaseListByIdDto);
    }

    @OperateModule('运行模块')
    @OperateType('转换接口')
    @OperateDesc('')
    @ApiOperation({title: 'covert curl url', description: '接口转换为curl'})
    @ApiResponse({status: 200, description: 'run caselist success.'})
    @Post('covert')
    async covertCurl(@Body() covertDto: CovertDto) {
        return await this.runService.covertCurl(covertDto);
    }

    @OperateModule('运行模块')
    @OperateType('运行场景接口')
    @OperateDesc('')
    @ApiOperation({title: 'run scene by id', description: '运行场景'})
    @ApiResponse({status: 200, description: 'run scene success.'})
    @Post('scene')
    async runScene(@Body() runSceneDto: RunSceneDto): Promise<any> {
        return await this.runService.runScene(runSceneDto);
    }
}
