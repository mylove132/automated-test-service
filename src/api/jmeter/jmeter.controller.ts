import {Controller, Get, Post, SetMetadata} from '@nestjs/common';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {JmeterService} from "./jmeter.service";



@ApiBearerAuth()
@ApiUseTags('jmeter')
@Controller('jmeter')
export class JmeterController {
  constructor(private jmeterService: JmeterService) {}

  @Get('download')
  @SetMetadata('isOpen', true)
  async jmeter_download(){
    return this.jmeterService.jmeterDownload();
  }
}
