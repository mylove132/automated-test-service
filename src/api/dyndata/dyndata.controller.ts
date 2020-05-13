import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { DynDataService } from "./dyndata.service";
import { DynDbEntity } from "./dyndb.entity";
import { CreateSqlDto, UpdateSqlDto, DbIdsDto, SqlIdsDto } from "./dto/dyndata.dto";


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

    @ApiOperation({ title: 'run sql by sqlId' })
    @ApiResponse({ status: 200, description: 'run sql by sqlId success.'})
    @Get('query')
    async querySqlController(@Query('sqlId') sqlId: number){
        return await this.dynDataService.queryDataByDbIdAndSqlIdService(sqlId);
    }

    @ApiOperation({ title: 'add db' })
    @ApiResponse({ status: 200, description: 'add db success.'})
    @Post('')
    async addDbController(@Body() dbEntity: DynDbEntity){
        return await this.dynDataService.addDbService(dbEntity);
    }

    @ApiOperation({ title: 'update db' })
    @ApiResponse({ status: 200, description: 'update db success.'})
    @Put('')
    async updateDbController(@Body() dbEntity: DynDbEntity){
        return await this.dynDataService.updateDbService(dbEntity);
    }

    @ApiOperation({ title: 'add db' })
    @ApiResponse({ status: 200, description: 'add db success.'})
    @Post('sql')
    async addSqlController(@Body() createSqlDto: CreateSqlDto){
        return await this.dynDataService.addSqlService(createSqlDto);
    }

    @ApiOperation({ title: 'update sql' })
    @ApiResponse({ status: 200, description: 'update sql success.'})
    @Put('sql')
    async updateSqlController(@Body() updateSqlDto: UpdateSqlDto){
        return await this.dynDataService.updateSqlService(updateSqlDto);
    }

    @ApiOperation({ title: 'del db' })
    @ApiResponse({ status: 200, description: 'del db success.'})
    @Delete('')
    async delDbController(@Body() dbIdsDto: DbIdsDto){
        return await this.dynDataService.delDbService(dbIdsDto);
    }

    @ApiOperation({ title: 'del sql' })
    @ApiResponse({ status: 200, description: 'del sql success.'})
    @Delete('sql')
    async delSqlController(@Body() SqlIdsDto: SqlIdsDto){
        return await this.dynDataService.delSqlService(SqlIdsDto);
    }

    @ApiOperation({ title: 'del sql' })
    @ApiResponse({ status: 200, description: 'del sql success.'})
    @Get('sql/exec')
    async runSqlController(@Query('dbId') dbId: number, @Query('sql') sql: string){
        return await this.dynDataService.runSqlService(dbId, sql)
    }

    @ApiOperation({ title: 'del sql' })
    @ApiResponse({ status: 200, description: 'del sql success.'})
    @Get('sql/grammarCheck')
    async grammarCheckController(@Query('sql') sql: string){
        return await this.dynDataService.grammarCheckService(sql);
    }
  
}
