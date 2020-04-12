import { Body, Controller, Post } from "@nestjs/common";
import { RunService } from "./run.service";
import { CovertDto, RunCaseByIdDto, RunCaseDto, RunCaseListByIdDto, RunSceneDto } from "./dto/run.dto";
import { ApiOperation, ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { OpeModule, OperateDesc, OpeType } from "../../utils/common.decorators";
import {OperateModule, OperateType} from "../../config/base.enum";

@ApiUseTags('run')
@Controller('run')
export class RunController {
    constructor(
        private runService: RunService,
    ) {
    }

    @OpeModule(OperateModule.RUN)
    @OpeType(OperateType.RUNTMPCASE)
    @OperateDesc('')
    @ApiOperation({title: 'run temp case', description: '运行http请求'})
    @ApiResponse({status: 200, description: 'run temp case success.'})
    @Post('script')
    async runTempCase(@Body() runCaseDto: RunCaseDto): Promise<any> {
        return await this.runService.runTempCase(runCaseDto);
    }

  @OpeModule(OperateModule.RUN)
  @OpeType(OperateType.RUNIDCASE)
    @OperateDesc('')
    @ApiOperation({title: 'run case by id', description: '运行某具体样例请求'})
    @ApiResponse({status: 200, description: 'run case success.'})
    @Post('case-script')
    async runCaseById(@Body() runCaseByIdDto: RunCaseByIdDto): Promise<any> {
        return await this.runService.runCaseById(runCaseByIdDto);
    }

  // @OpeModule(OperateModule.RUN)
  // @OpeType(OperateType.RUNTMPCASE)
  //   @OperateDesc('')
  //   @ApiOperation({title: 'run caselist by id', description: '运行样例里的所有接口请求'})
  //   @ApiResponse({status: 200, description: 'run caselist success.'})
  //   @Post('caselist-script')
  //   async runCaseListById(@Body() runCaseListByIdDto: RunCaseListByIdDto): Promise<any> {
  //       return await this.runService.runCaseListById(runCaseListByIdDto);
  //   }

  @OpeModule(OperateModule.RUN)
  @OpeType(OperateType.COVERT)
    @OperateDesc('')
    @ApiOperation({title: 'covert curl url', description: '接口转换为curl'})
    @ApiResponse({status: 200, description: 'run caselist success.'})
    @Post('covert')
    async covertCurl(@Body() covertDto: CovertDto) {
        return await this.runService.covertCurl(covertDto);
    }

  // @OpeModule(OperateModule.RUN)
  // @OpeType(OperateType.RUNSCENE)
  //   @OperateDesc('')
  //   @ApiOperation({title: 'run scene by id', description: '运行场景'})
  //   @ApiResponse({status: 200, description: 'run scene success.'})
  //   @Post('scene')
  //   async runScene(@Body() runSceneDto: RunSceneDto): Promise<any> {
  //       return await this.runService.runScene(runSceneDto);
  //   }
}
