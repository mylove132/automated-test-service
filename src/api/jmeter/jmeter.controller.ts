import {Body, Controller, Delete, Get, Post, Put, SetMetadata, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {JmeterService} from "./jmeter.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {CreateJmeterDto, DeleteJmeterDto, UpdateJmeterDto} from "./dto/jmeter.dto";



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
    async jmeterDetele(@Body() deleteJmeterDto: DeleteJmeterDto){
        return this.jmeterService.deleteJmeterInfo(deleteJmeterDto);
    }
}
