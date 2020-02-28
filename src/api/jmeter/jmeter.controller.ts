import { InjectQueue } from '@nestjs/bull';
import {Body, Controller, Post} from '@nestjs/common';
import { Queue } from 'bull';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';



@ApiBearerAuth()
@ApiUseTags('jmeter')
@Controller('jmeter')
export class JmeterController {
  constructor(@InjectQueue('jmeter') private readonly jmeterQueue: Queue) {}

  @Post('run')
  async exec_jmeter(@Body() caseIds: number[]) {
    await this.jmeterQueue.add('exec_jmeter', caseIds);
  }
}
