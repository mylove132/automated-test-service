import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import { TaskIdsDto, SIngleTaskDto, UpdateTaskDto} from './dto/scheduler.dto';
import {SchedulerService} from './scheduler.service';
import {OperateDesc, OperateModule, OperateType} from "../../utils/common.decorators";

ApiBearerAuth()
@ApiUseTags('定时任务')
@Controller('scheduler')
export class SchedulerController {

    constructor(private readonly schedulerService: SchedulerService) {}

    @OperateModule('定时任务模块')
    @OperateType('添加定时任务')
    @OperateDesc('')
    @Post('')
    async addTask(@Body() singleTaskDto: SIngleTaskDto){
        return await this.schedulerService.addRunSingleTask(singleTaskDto);
    }

    @OperateModule('定时任务模块')
    @OperateType('更新定时任务')
    @OperateDesc('')
    @Put('')
    async updateTask(@Body() updateTaskDto: UpdateTaskDto){
        return await this.schedulerService.updateRunSingleTask(updateTaskDto);
    }

    @OperateModule('定时任务模块')
    @OperateType('查询定时任务')
    @OperateDesc('')
    @Get('')
    async getAllJobs(@Query('status')status?:number,  @Query('page') page: number = 0, @Query('limit') limit: number = 10){
        limit = limit > 100 ? 100 : limit;
        return this.schedulerService.getAllJobs(status, {page, limit});
    }

    @OperateModule('定时任务模块')
    @OperateType('删除定时任务')
    @OperateDesc('')
    @Delete('')
    async deleRunnigJobs(@Body() taskIdsDto: TaskIdsDto){
        return this.schedulerService.deleteJob(taskIdsDto);
    }

    @OperateModule('定时任务模块')
    @OperateType('停止定时任务')
    @OperateDesc('')
    @Post('stop')
    async stopJobs(@Body() taskIdsDto: TaskIdsDto){
        return this.schedulerService.stopJob(taskIdsDto);
    }z

    @OperateModule('定时任务模块')
    @OperateType('停止系统定时任务')
    @OperateDesc('')
    @Get('stop_system_task')
    async stopSystemTaskJob(){
        return this.schedulerService.delCheckJobTask();
    }

    @OperateModule('定时任务模块')
    @OperateType('重启系统定时任务')
    @OperateDesc('')
    @Get('restart_system_task')
    async restartSystemTaskJob(){
        return this.schedulerService.restartSystemCheckJobTask();
    }

    @OperateModule('定时任务模块')
    @OperateType('重启定时任务')
    @OperateDesc('')
    @Post('restart')
    async restartTaskJob(@Body() taskIdsDto: TaskIdsDto){
        return this.schedulerService.restartCheckJobTask(taskIdsDto);
    }

    @OperateModule('定时任务模块')
    @OperateType('检查cron表达式')
    @OperateDesc('')
    @Get('check-cron')
    async checkCron(@Query('cron') cron: string){
        console.log(cron)
        return await this.schedulerService.checkCron(cron);
    }
}
