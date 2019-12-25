import { Controller, Post, Body } from '@nestjs/common';
import { RunService } from './run.service';
import { RunCaseDto } from './dto/run.dto';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('run')
@Controller('run')
export class RunController {
  constructor(
    private runService : RunService,
  ) {}

  @ApiOperation({ title: 'run temp case', description: '运行http请求' })
  @ApiResponse({ status: 200, description: 'update case success.'})
  @Post('script')
  async runTempCase(@Body() runCaseDto: RunCaseDto): Promise<any> {
    return await this.runService.runTempCase(runCaseDto);
  }
}