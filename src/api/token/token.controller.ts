import {ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import {TokenService} from "./token.service";
import {CreateTokenDto, TokenPlatform} from "./dto/token.dto";
import {CaseType} from "../case/dto/case.dto";
import {options} from "tsconfig-paths/lib/options";


ApiBearerAuth()
@ApiUseTags('token')
@Controller('token')
export class TokenController {

    constructor(private readonly tokenService: TokenService) {
    }

    @Post('')
    async addToken(@Body() createTokenDto: CreateTokenDto) {
        return await this.tokenService.addTokenService(createTokenDto);
    }


    @ApiOperation({title: 'query token'})
    @ApiResponse({status: 200, description: 'query token success.'})
    @Get('')
    async findCaseById(@Query('envId') envId?: number, @Query('tokenPlatform') tokenPlatform?: TokenPlatform, @Query('page') page: number = 0, @Query('limit') limit: number = 10) {
        limit = limit > 100 ? 100 : limit;
        return this.tokenService.findCase(envId, tokenPlatform, {page, limit});
    }
}
