import {Body, Controller, Delete, Get, Post, Put, SetMetadata, UploadedFile, UseInterceptors, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {JmeterService} from "./jmeter.service";
import {CreateJmeterDto, JmeterIdsDto, UpdateJmeterDto} from "./dto/jmeter.dto";


@ApiBearerAuth()
@ApiUseTags('jmeter')
@Controller('jmeter')
export class JmeterController {
  constructor(private jmeterService: JmeterService) {}

  // @Post('upload')
  // //@UseInterceptors(FileInterceptor('file'))
  // @SetMetadata('isOpen', true)
  // async jmeterUpload(@Body() createJmeterDto: CreateJmeterDto){
  //   return await this.jmeterService.uploadFile(createJmeterDto);
  // }

  @Post('')
  @SetMetadata('isOpen', true)
  async jmeterCreateController (@Body() createJmeterDto: CreateJmeterDto){
    return this.jmeterService.createJmeterInfoService(createJmeterDto);
  }

  @Put('')
  @SetMetadata('isOpen', true)
  async jmeterUpdateController (@Body() updateJmeterDto: UpdateJmeterDto){
    return this.jmeterService.updateJmeterInfoService(updateJmeterDto);
  }

    @Delete('')
    @SetMetadata('isOpen', true)
    async jmeterDetele(@Body() jmeterIdsDto: JmeterIdsDto){
        return this.jmeterService.deleteJmeterInfoService(jmeterIdsDto);
    }

  @Get('watchResult')
  @SetMetadata('isOpen', true)
  async watchJmeterResultController (@Query('md5') md5: string){
    return this.jmeterService.findResultService(md5);
  }

  @Get('jmeterList')
  @SetMetadata('isOpen', true)
  async queryJmeterListController (@Query('name') name?: string, @Query('page') page: number = 0, @Query('limit') limit: number = 10){
    limit = limit > 100 ? 100 : limit;
    return await this.jmeterService.queryJmeterListService(name, {page, limit});
  }

  @Get('jmeterResultList')
  @SetMetadata('isOpen', true)
  async queryJmeterResultListController (@Query('name') name?: string, @Query('page') page: number = 0, @Query('limit') limit: number = 10){
    limit = limit > 100 ? 100 : limit;
    return await this.jmeterService.queryJmeterResultListService(name, {page, limit});
  }

  @Get('jmeterResultListByJmeterId')
  @SetMetadata('isOpen', true)
  async queryJmeterResultListByJmeterIdController (@Query('jmeterId') jmeterId: number, @Query('page') page: number = 0, @Query('limit') limit: number = 10){
    limit = limit > 100 ? 100 : limit;
    return await this.jmeterService.queryJmeterResultListByJmeterIdService(jmeterId, {page, limit});
  }

  @Get('watchLog')
  @SetMetadata('isOpen', true)
  async watchLogController (@Query('md5') md5: string){
    return this.jmeterService.catLogService(md5);
  }
}
