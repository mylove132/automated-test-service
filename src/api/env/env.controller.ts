import {Body, Controller, Delete, Get, Post, Put, Query, ValidationPipe} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {EnvService} from './env.service';
import {EnvEntity} from './env.entity';
import {AddEndpointDto, DeleteEndpointDto, QueryEndpointDto, DeleteEnvDto} from './dto/env.dto';
import {OperateDesc, OperateModule, OperateType} from "../../utils/common.decorators";

@ApiBearerAuth()
@ApiUseTags('env')
@Controller('env')
export class EnvController {

    constructor(private readonly envService: EnvService) {}

    @OperateModule('环境模块')
    @OperateType('查询环境')
    @OperateDesc('')
    @ApiOperation({ title: 'query all env' })
    @ApiResponse({ status: 200, description: 'query all env success.'})
    @Get()
    async queryAllEnv() {
        return this.envService.allEnv();
    }

    @OperateModule('环境模块')
    @OperateType('创建环境')
    @OperateDesc('')
    @ApiOperation({ title: 'create env' })
    @ApiResponse({ status: 200, description: 'create env success.'})
    @Post()
    async createEnv(@Body() envEntity: EnvEntity) {
        return this.envService.addEnv(envEntity);
    }

    @OperateModule('环境模块')
    @OperateType('更新环境')
    @OperateDesc('')
    @ApiOperation({ title: 'update env' })
    @ApiResponse({ status: 200, description: 'update env success.'})
    @Put()
    async updateEnv(@Body() envEntity: EnvEntity) {
        return this.envService.updateEnv(envEntity);
    }

    @OperateModule('环境模块')
    @OperateType('删除环境')
    @OperateDesc('')
    @ApiOperation({ title: 'delete env' })
    @ApiResponse({ status: 200, description: 'delete env success.'})
    @Delete()
    async deleteEnv(@Body() deleteEnvDto: DeleteEnvDto) {
        return this.envService.deleteEnv(deleteEnvDto);
    }

    @OperateModule('endpoint模块')
    @OperateType('创建endpoint')
    @OperateDesc('')
    @ApiOperation({ title: 'create endpoint' })
    @ApiResponse({ status: 200, description: 'create endpoint success.'})
    @Post('endpoint')
    async createEndpoint(@Body() addEndpointDto: AddEndpointDto) {
        return this.envService.addEndpoint(addEndpointDto);
    }

    @OperateModule('endpoint模块')
    @OperateType('查询endpoint')
    @OperateDesc('')
    @ApiOperation({ title: 'find endpoint' })
    @ApiResponse({ status: 200, description: 'find endpoint success.'})
    @Get('/endpoint')
    async findEndpointByEnvId( @Query('envIds') envIds){
        return this.envService.findEndpointByEnv(envIds);
    }

    @OperateModule('endpoint模块')
    @OperateType('删除endpoint')
    @OperateDesc('')
    @ApiOperation({ title: 'find endpoint' })
    @ApiResponse({ status: 200, description: 'find endpoint success.'})
    @Delete('/endpoint')
    async deleteEndpointByIds(@Body() deleteEndpointDto: DeleteEndpointDto){
        return this.envService.deleteEndpointByIds(deleteEndpointDto);
    }

}
