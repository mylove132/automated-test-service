import { ApiOperation, ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { TokenService } from "./token.service";
import { CreateTokenDto, DeleteTokenDto, UpdateTokenDto } from "./dto/token.dto";
import { OpeModule, OperateDesc, OpeType } from "../../utils/common.decorators";
import { OperateModule, OperateType } from "../../config/base.enum";

@ApiUseTags("token")
@Controller("token")
export class TokenController {

  constructor(private readonly tokenService: TokenService) {
  }

  @OpeModule(OperateModule.TOKEN)
  @OpeType(OperateType.CREAT)
  @OperateDesc("")
  @ApiOperation({ title: "create token" })
  @ApiResponse({ status: 200, description: "create token success." })
  @Post("")
  async addTokenController(@Body() createTokenDto: CreateTokenDto) {
    return await this.tokenService.addTokenService(createTokenDto);
  }

  @OpeModule(OperateModule.TOKEN)
  @OpeType(OperateType.UPDATE)
  @OperateDesc("")
  @ApiOperation({ title: "update token" })
  @ApiResponse({ status: 200, description: "update token success." })
  @Put("")
  async updateTokenController(@Body() updateTokenDto: UpdateTokenDto) {
    return await this.tokenService.updateTokenService(updateTokenDto);
  }


  @ApiOperation({ title: "query token" })
  @ApiResponse({ status: 200, description: "query token success." })
  @Get("")
  async findCaseByIdController(@Query("envId") envId?: number, @Query("platformCodeId") platformCodeId?: number,
                               @Query("page") page: number = 0, @Query("limit") limit: number = 10) {
    limit = limit > 100 ? 100 : limit;
    return this.tokenService.findToken(envId, platformCodeId, { page, limit });
  }

  @Get("platform")
  async findTokenOfPlatformController() {
    return await this.tokenService.getAllTokenOfPlatform();
  }

  @Get("env")
  async findTokenOfEnvController(@Query("platformCodeId") platformCodeId: number) {
    return await this.tokenService.getAllTokenOfEnv(platformCodeId);
  }

  @Get("userAndToken")
  async findTokenOfEnvAndPlatformController(@Query("platformCodeId") platformCodeId: number, @Query("envId") envId: number) {
    return await this.tokenService.getAllTokenByEnvIdAndPlatformId(platformCodeId, envId);
  }

  @OpeModule(OperateModule.TOKEN)
  @OpeType(OperateType.DELETE)
  @OperateDesc("")
  @ApiOperation({ title: "delete token" })
  @ApiResponse({ status: 200, description: "delete token success." })
  @Delete("")
  async deleteTokenController(@Body() deleteTokenDto: DeleteTokenDto) {
    return this.tokenService.deleteById(deleteTokenDto);
  }
}
