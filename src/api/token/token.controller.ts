import {ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Post, Put, Query} from "@nestjs/common";
import {TokenService} from "./token.service";
import {CreateTokenDto, DeleteTokenDto, UpdateTokenDto} from "./dto/token.dto";
import {OperateDesc, OperateModule, OperateType} from "../../utils/common.decorators";

@ApiUseTags('token')
@Controller('token')
export class TokenController {

    constructor(private readonly tokenService: TokenService) {
    }

    @OperateModule('token模块')
    @OperateType('添加token')
    @OperateDesc('')
    @ApiOperation({title: 'create token'})
    @ApiResponse({status: 200, description: 'create token success.'})
    @Post('')
    async addTokenController(@Body() createTokenDto: CreateTokenDto) {
        return await this.tokenService.addTokenService(createTokenDto);
    }

    @OperateModule('token模块')
    @OperateType('更新token')
    @OperateDesc('')
    @ApiOperation({title: 'update token'})
    @ApiResponse({status: 200, description: 'update token success.'})
    @Put('')
    async updateTokenController(@Body() updateTokenDto: UpdateTokenDto) {
        return await this.tokenService.updateTokenService(updateTokenDto);
    }

    @OperateModule('token模块')
    @OperateType('查询token')
    @OperateDesc('')
    @ApiOperation({title: 'query token'})
    @ApiResponse({status: 200, description: 'query token success.'})
    @Get('')
    async findCaseByIdController(@Query('envId') envId?: number, @Query('platformCodeId') platformCodeId?: number,
                                 @Query('page') page: number = 0, @Query('limit') limit: number = 10) {
        limit = limit > 100 ? 100 : limit;
        return this.tokenService.findToken(envId, platformCodeId, {page, limit});
    }

    @Get('platform')
    async findTokenOfPlatformController(){
        return await this.tokenService.getAllTokenOfPlatform();
    }

    @Get('env')
    async findTokenOfEnvController(@Query('platformCodeId') platformCodeId: number,){
        return await this.tokenService.getAllTokenOfEnv(platformCodeId);
    }

    @Get('userAndToken')
    async findTokenOfEnvAndPlatformController(@Query('platformCodeId') platformCodeId: number,@Query('envId') envId: number,){
        return await this.tokenService.getAllTokenByEnvIdAndPlatformId(platformCodeId, envId);
    }

    @OperateModule('token模块')
    @OperateType('删除token')
    @OperateDesc('')
    @ApiOperation({ title: 'delete token' })
    @ApiResponse({ status: 200, description: 'delete token success.'})
    @Delete('')
    async deleteTokenController(@Body() deleteTokenDto: DeleteTokenDto) {
        return this.tokenService.deleteById(deleteTokenDto);
    }
}
