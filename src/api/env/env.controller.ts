import {Body, Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {EnvService} from './env.service';
import {EnvEntity} from './env.entity';
import {AddEndpointDto} from './dto/env.dto';

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

    @ApiOperation({ title: 'create env' })
    @ApiResponse({ status: 200, description: 'create env success.'})
    @Post()
    async createEnv(@Body() envEntity: EnvEntity) {
        return this.envService.addEnv(envEntity);
    }

    @ApiOperation({ title: 'update env' })
    @ApiResponse({ status: 200, description: 'update env success.'})
    @Put()
    async updateEnv(@Body() envEntity: EnvEntity) {
        return this.envService.updateEnv(envEntity);
    }

    @ApiOperation({ title: 'delete env' })
    @ApiResponse({ status: 200, description: 'delete env success.'})
    @Delete()
    async deleteEnv(@Query('envIds') envIds: string) {
        return this.envService.deleteEnv(envIds);
    }

    @ApiOperation({ title: 'create endpoint' })
    @ApiResponse({ status: 200, description: 'create endpoint success.'})
    @Post('endpoint')
    async createEndpoint(@Body() addEndpointDto: AddEndpointDto) {
        return this.envService.addEndpoint(addEndpointDto);
    }

    @ApiOperation({ title: 'find endpoint' })
    @ApiResponse({ status: 200, description: 'find endpoint success.'})
    @Get('/endpoint')
    async findEndpointByEnvId(){
        return this.envService.findEndpointByEnv();
    }

    @ApiOperation({ title: 'find endpoint' })
    @ApiResponse({ status: 200, description: 'find endpoint success.'})
    @Delete('/endpoint')
    async deleteEndpointByIds(@Query('endpointIds')endpointIds: string){
        return this.envService.deleteEndpointByIds(endpointIds);
    }

}
