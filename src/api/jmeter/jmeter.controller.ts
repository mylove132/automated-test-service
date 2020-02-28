import { InjectQueue } from '@nestjs/bull';
import {Body, Controller, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import { Queue } from 'bull';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {FileInterceptor} from "@nestjs/platform-express";
import {File} from "@babel/types";


@ApiBearerAuth()
@ApiUseTags('jmeter')
@Controller('jmeter')
export class JmeterController {
  constructor(@InjectQueue('jmeter') private readonly jmeterQueue: Queue) {}

  @Post('run')
  async exec_jmeter(@Body() caseIds: number[]) {
    await this.jmeterQueue.add('exec_jmeter', caseIds);
  }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file) {
      console.log(file.buffer)
    }
}
