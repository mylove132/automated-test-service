import {ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Post, Put, Query} from "@nestjs/common";
import {TokenService} from "./token.service";
import {CreateTokenDto, DeleteTokenDto, UpdateTokenDto} from "./dto/token.dto";


ApiBearerAuth()
@ApiUseTags('token')
@Controller('token')
export class TokenController {

    constructor(private readonly tokenService: TokenService) {
    }

    @ApiOperation({title: 'create token'})
    @ApiResponse({status: 200, description: 'create token success.'})
    @Post('')
    async addTokenCrontroller(@Body() createTokenDto: CreateTokenDto) {
        return await this.tokenService.addTokenService(createTokenDto);
    }

    @ApiOperation({title: 'update token'})
    @ApiResponse({status: 200, description: 'update token success.'})
    @Put('')
    async updateTokenCrontroller(@Body() updateTokenDto: UpdateTokenDto) {
        return await this.tokenService.updateTokenService(updateTokenDto);
    }


    @ApiOperation({title: 'query token'})
    @ApiResponse({status: 200, description: 'query token success.'})
    @Get('')
    async findCaseById(@Query('envId') envId?: number, @Query('platformCode') platformCode?: string,
                       @Query('page') page: number = 0, @Query('limit') limit: number = 10) {
        limit = limit > 100 ? 100 : limit;
        return this.tokenService.findCase(envId, platformCode, {page, limit});
    }

    @ApiOperation({ title: 'delete token' })
    @ApiResponse({ status: 200, description: 'delete token success.'})
    @Delete('')
    async deleteTokenCrontroller(@Body() deleteTokenDto: DeleteTokenDto) {
        return this.tokenService.deleteById(deleteTokenDto);
    }
}
