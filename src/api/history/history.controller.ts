import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { HistoryService } from './history.service';
import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { HistoryEntity } from './history.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import {OperateDesc, OperateModule, OperateType} from "../../utils/common.decorators";

@ApiUseTags('history')
@Controller('history')
export class HistoryController {
  constructor(
    private historyService : HistoryService,
  ) {}


  @ApiOperation({ title: 'history list', description: '查询历史记录列表' })
  @ApiResponse({ status: 200, description: 'query history list success.'})
  @Get('list')
  async findHistoryList(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('path') path?: string): Promise<Pagination<HistoryEntity>> {
    return this.historyService.findHistoryList(path, {page, limit});
  }
}
