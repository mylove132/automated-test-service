import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { OperateService } from "./operate.service";
import {OperateModule, OperateType} from "../../config/base.enum";
import { Pagination } from "nestjs-typeorm-paginate";
import { OperateEntity } from "./operate.entity";

@ApiUseTags("operate")
@Controller("operate")
export class OperateController {
  constructor(
    private operateService : OperateService
  ) {}


  @ApiOperation({title:'query operate list',description:'query operate list'})
  @ApiResponse({ status: 200, description: "query operate list success."})
  @Get("")
  async findOperateListController (@Query("page") page: number = 1, @Query("limit") limit: number = 10, @Query("userId") userId?: number, @Query("operateModule") operateModule?: OperateModule,
                        @Query("operateType") operateType?: OperateType,  @Query("keyword") keyword?: string): Promise<Pagination<OperateEntity>> {
    return this.operateService.findOperateService(userId, operateModule,operateType,keyword,{page, limit});
  }

  // @ApiOperation({title:'query operate by keyword list',description:'query operate list'})
  // @ApiResponse({ status: 200, description: "query operate by keyword list success."})
  // @Get("/query")
  // async findOperateByKeywords(@Query("page") page: number = 1, @Query("limit") limit: number = 10,
  //                       @Query("keyword") keyword?: string): Promise<Pagination<OperateEntity>> {
  //   return this.operateService.findOperateByKeyword(keyword,{page, limit});
  // }

}
