import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { DynDataService } from "./dyndata.service";


@ApiBearerAuth()
@ApiUseTags('db')
@Controller('db')
export class DynDataController {

    constructor(private readonly dynDataService: DynDataService) {}

    @ApiOperation({ title: 'query all db' })
    @ApiResponse({ status: 200, description: 'query all db success.'})
    @Get('')
    async queryAllDbController(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
        return this.dynDataService.getAllDynDbService({page, limit});
    }

    @ApiOperation({ title: 'query all sql by dbId' })
    @ApiResponse({ status: 200, description: 'query all sql by dbId success.'})
    @Get('sql')
    async queryAllSqlController(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('dbId') dbId?: number) {
        return this.dynDataService.getAllSqlByDbIdService(dbId, {page, limit});
    }
  
}
