import {Controller, Post, Body, Query, Get} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiUseTags} from '@nestjs/swagger';
import {SceneService} from "./scene.service";
import {CreateSceneDto} from "./dto/scene.dto";
import {Pagination} from "nestjs-typeorm-paginate";
import {SceneEntity} from "./scene.entity";

@ApiUseTags('scene')
@Controller('scene')
export class SceneController {
    constructor(
        private sceneService: SceneService,
    ) {
    }

    @ApiOperation({title: 'add scene', description: '添加场景用例'})
    @ApiResponse({status: 200, description: 'add scene success.'})
    @Post('')
    async addSceneCrontroller(@Body() createSceneDto: CreateSceneDto): Promise<any> {
        return await this.sceneService.addSceneService(createSceneDto);
    }

    @ApiOperation({title: 'get scene', description: '获取场景'})
    @ApiResponse({status: 200, description: 'get scene success.'})
    @Get('')
    async findHistoryList(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('catalogId') catalogId?: number): Promise<Pagination<SceneEntity>> {
        return this.sceneService.findSceneService(catalogId, {page, limit});
    }

}
