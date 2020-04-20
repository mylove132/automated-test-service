import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { EnvService } from "./env.service";
import { EnvEntity } from "./env.entity";
import { AddEndpointDto, DeleteEndpointDto, DeleteEnvDto } from "./dto/env.dto";
import { OpeModule, OperateDesc, OpeType } from "../../utils/common.decorators";
import {OperateModule, OperateType} from "../../config/base.enum";

@ApiBearerAuth()
@ApiUseTags('env')
@Controller('env')
export class EnvController {

    constructor(private readonly envService: EnvService) {}

    @ApiOperation({ title: 'query all env' })
    @ApiResponse({ status: 200, description: 'query all env success.'})
    @Get()
    async queryAllEnv() {
        return this.envService.allEnv();
    }

    @OpeModule(OperateModule.ENV)
    @OpeType(OperateType.CREAT)
    @OperateDesc('')
    @ApiOperation({ title: 'create env' })
    @ApiResponse({ status: 200, description: 'create env success.'})
    @Post()
    async createEnv(@Body() envEntity: EnvEntity) {
        return this.envService.addEnv(envEntity);
    }

    @OpeModule(OperateModule.ENV)
    @OpeType(OperateType.UPDATE)
    @OperateDesc('')
    @ApiOperation({ title: 'update env' })
    @ApiResponse({ status: 200, description: 'update env success.'})
    @Put()
    async updateEnv(@Body() envEntity: EnvEntity) {
        return this.envService.updateEnv(envEntity);
    }

   @OpeModule(OperateModule.ENV)
   @OpeType(OperateType.DELETE)
    @OperateDesc('')
    @ApiOperation({ title: 'delete env' })
    @ApiResponse({ status: 200, description: 'delete env success.'})
    @Delete()
    async deleteEnv(@Body() deleteEnvDto: DeleteEnvDto) {
        return this.envService.deleteEnv(deleteEnvDto);
    }

    @OpeModule(OperateModule.ENDPOINT)
    @OpeType(OperateType.CREAT)
    @OperateDesc('')
    @ApiOperation({ title: 'create endpoint' })
    @ApiResponse({ status: 200, description: 'create endpoint success.'})
    @Post('endpoint')
    async createEndpoint(@Body() addEndpointDto: AddEndpointDto) {
        return this.envService.addEndpoint(addEndpointDto);
    }

    @ApiOperation({ title: 'find endpoint' })
    @ApiResponse({ status: 200, description: 'find endpoint success.'})
    @Get('/endpoint')
    async findEndpointByEnvId( @Query('envIds') envIds){
        return this.envService.findEndpointByEnv(envIds);
    }


  @ApiOperation({ title: 'find endpoint' })
  @ApiResponse({ status: 200, description: 'find endpoint success.'})
  @Get('/all_endpoint')
  async findEndpoint(){
    return this.envService.findAllEndpointService();
  }

    @OpeModule(OperateModule.ENDPOINT)
    @OpeType(OperateType.DELETE)
    @OperateDesc('')
    @ApiOperation({ title: 'find endpoint' })
    @ApiResponse({ status: 200, description: 'find endpoint success.'})
    @Delete('/endpoint')
    async deleteEndpointByIds(@Body() deleteEndpointDto: DeleteEndpointDto){
        return this.envService.deleteEndpointByIds(deleteEndpointDto);
    }

}
