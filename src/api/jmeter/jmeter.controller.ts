import {Body, Controller, Delete, Get, Post, Put, SetMetadata, UploadedFile, UseInterceptors, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {JmeterService} from "./jmeter.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {CreateJmeterDto, JmeterIdsDto, UpdateJmeterDto, JmeterIdDto} from "./dto/jmeter.dto";


@ApiBearerAuth()
@ApiUseTags('jmeter')
@Controller('jmeter')
export class JmeterController {
  constructor(private jmeterService: JmeterService) {}

  @Get('download')
  @SetMetadata('isOpen', true)
  async jmeterDownload(){
    return this.jmeterService.jmeterDownload();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @SetMetadata('isOpen', true)
  async jmeterUpload(@UploadedFile() file){
    return await this.jmeterService.uploadFile(file);
  }

  @Post('')
  @SetMetadata('isOpen', true)
  async jmeterCreate(@Body() createJmeterDto: CreateJmeterDto){
    return this.jmeterService.createJmeterInfo(createJmeterDto);
  }

  @Put('')
  @SetMetadata('isOpen', true)
  async jmeterUpdate(@Body() updateJmeterDto: UpdateJmeterDto){
    return this.jmeterService.updateJmeterInfo(updateJmeterDto);
  }

    @Delete('')
    @SetMetadata('isOpen', true)
    async jmeterDetele(@Body() jmeterIdsDto: JmeterIdsDto){
        return this.jmeterService.deleteJmeterInfo(jmeterIdsDto);
    }

  @Get('watchResult')
  @SetMetadata('isOpen', true)
  async watchJmeterResult(@Query('md5') md5: string){
    return this.jmeterService.findResult(md5);
  }

  @Get('jmeterResultList')
  @SetMetadata('isOpen', true)
  async queryJmeterResultList(@Query('name') name?: string, @Query('page') page: number = 0, @Query('limit') limit: number = 10){
    limit = limit > 100 ? 100 : limit;
    return await this.jmeterService.queryJmeterResultList(name, {page, limit});
  }

  @Get('watchLog')
  @SetMetadata('isOpen', true)
  async watchLog(@Query('md5') md5: string){
    return this.jmeterService.catLog(md5);
  }
}
