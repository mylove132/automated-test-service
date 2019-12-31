import { Controller, Post, Body } from '@nestjs/common';
import { RunService } from './run.service';
import { RunCaseDto, RunCaseByIdDto, RunCaseListByIdDto } from './dto/run.dto';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('run')
@Controller('run')
export class RunController {
  constructor(
    private runService : RunService,
  ) {}

  @ApiOperation({ title: 'run temp case', description: '运行http请求' })
  @ApiResponse({ status: 200, description: 'run temp case success.'})
  @Post('script')
  async runTempCase(@Body() runCaseDto: RunCaseDto): Promise<any> {
    return await this.runService.runTempCase(runCaseDto);
  }

  @ApiOperation({ title: 'run case by id', description: '运行某具体样例请求' })
  @ApiResponse({ status: 200, description: 'run case success.'})
  @Post('case-script')
  async runCaseById(@Body() runCaseByIdDto: RunCaseByIdDto): Promise<any> {
    return await this.runService.runCaseById(runCaseByIdDto);
  }

  @ApiOperation({ title: 'run caselist by id', description: '运行样例里的所有接口请求' })
  @ApiResponse({ status: 200, description: 'run caselist success.'})
  @Post('caselist-script')
  async runCaseListById(@Body() runCaseListByIdDto: RunCaseListByIdDto): Promise<any> {
    return await this.runService.runCaseListById(runCaseListByIdDto);
  }
}