import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { EnvService } from "./env.service";
import { EnvEntity } from "./env.entity";
import { AddEndpointDto, DeleteEndpointDto, DeleteEnvDto } from "./dto/env.dto";
import { OpeModule, OperateDesc, OpeType } from "../../utils/common.decorators";
import {OperateModule, OperateType} from "../../config/base.enum";
import { EndpointEntity } from "./endpoint.entity";

@ApiBearerAuth()
@ApiUseTags('env')
@Controller('env')
export class EnvController {

    constructor(private readonly envService: EnvService) {}

    @ApiOperation({ title: 'query all env' })
    @ApiResponse({ status: 200, description: 'query all env success.'})
    @Get()
    async queryAllEnvController() {
        return this.envService.allEnvService();
    }

    @OpeModule(OperateModule.ENV)
    @OpeType(OperateType.CREAT)
    @OperateDesc('')
    @ApiOperation({ title: 'create env' })
    @ApiResponse({ status: 200, description: 'create env success.'})
    @Post()
    async createEnvController(@Body() envEntity: EnvEntity) {
        return this.envService.addEnvService(envEntity);
    }

    @OpeModule(OperateModule.ENV)
    @OpeType(OperateType.UPDATE)
    @OperateDesc('')
    @ApiOperation({ title: 'update env' })
    @ApiResponse({ status: 200, description: 'update env success.'})
    @Put()
    async updateEnvController(@Body() envEntity: EnvEntity) {
        return this.envService.updateEnvService(envEntity);
    }

    @OpeModule(OperateModule.ENDPOINT)
    @OpeType(OperateType.UPDATE)
    @OperateDesc('')
    @ApiOperation({ title: 'update endpoint' })
    @ApiResponse({ status: 200, description: 'update endpoint success.'})
    @Put('endpoint')
    async updateEndpointController(@Body() endpointEntity: EndpointEntity) {
        return this.envService.updateEndpointService(endpointEntity);
    }

   @OpeModule(OperateModule.ENV)
   @OpeType(OperateType.DELETE)
    @OperateDesc('')
    @ApiOperation({ title: 'delete env' })
    @ApiResponse({ status: 200, description: 'delete env success.'})
    @Delete()
    async deleteEnvController(@Body() deleteEnvDto: DeleteEnvDto) {
        return this.envService.deleteEnvService(deleteEnvDto);
    }

    @OpeModule(OperateModule.ENDPOINT)
    @OpeType(OperateType.CREAT)
    @OperateDesc('')
    @ApiOperation({ title: 'create endpoint' })
    @ApiResponse({ status: 200, description: 'create endpoint success.'})
    @Post('endpoint')
    async createEndpointController(@Body() addEndpointDto: AddEndpointDto) {
        return this.envService.addEndpointService(addEndpointDto);
    }

    @ApiOperation({ title: 'find endpoint' })
    @ApiResponse({ status: 200, description: 'find endpoint success.'})
    @Get('/endpoint')
    async findEndpointByEnvIdController( @Query('envIds') envIds){
        return this.envService.findEndpointByEnv(envIds);
    }


  @ApiOperation({ title: 'find endpoint' })
  @ApiResponse({ status: 200, description: 'find endpoint success.'})
  @Get('/all_endpoint')
  async findEndpointController(){
    return this.envService.findAllEndpointService();
  }

    @OpeModule(OperateModule.ENDPOINT)
    @OpeType(OperateType.DELETE)
    @OperateDesc('')
    @ApiOperation({ title: 'find endpoint' })
    @ApiResponse({ status: 200, description: 'find endpoint success.'})
    @Delete('/endpoint')
    async deleteEndpointByIdsController(@Body() deleteEndpointDto: DeleteEndpointDto){
        return this.envService.deleteEndpointByIdsService(deleteEndpointDto);
    }

}
