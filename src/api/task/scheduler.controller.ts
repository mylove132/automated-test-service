import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import { TaskIdsDto, SIngleTaskDto, UpdateTaskDto} from './dto/scheduler.dto';
import {SchedulerService} from './scheduler.service';

ApiBearerAuth()
@ApiUseTags('定时任务')
@Controller('scheduler')
export class SchedulerController {

    constructor(private readonly schedulerService: SchedulerService) {}

    @Post('')
    async addTask(@Body() singleTaskDto: SIngleTaskDto){
        return await this.schedulerService.addRunSingleTask(singleTaskDto);
    }

    @Put('')
    async updateTask(@Body() updateTaskDto: UpdateTaskDto){
        return await this.schedulerService.updateRunSingleTask(updateTaskDto);
    }

    @Get('')
    async getAllJobs(@Query('status')status?:number,  @Query('page') page: number = 0, @Query('limit') limit: number = 10){
        limit = limit > 100 ? 100 : limit;
        return this.schedulerService.getAllJobs(status, {page, limit});
    }

    @Delete('')
    async deleRunnigJobs(@Body() taskIdsDto: TaskIdsDto){
        return this.schedulerService.deleteJob(taskIdsDto);
    }

    @Post('stop')
    async stopJobs(@Body() taskIdsDto: TaskIdsDto){
        return this.schedulerService.stopJob(taskIdsDto);
    }z

    @Get('stop_system_task')
    async stopSystemTaskJob(){
        return this.schedulerService.delCheckJobTask();
    }
    @Get('restart_system_task')
    async restartSystemTaskJob(){
        return this.schedulerService.restartSystemCheckJobTask();
    }

    @Post('restart')
    async restartTaskJob(@Body() taskIdsDto: TaskIdsDto){
        return this.schedulerService.restartCheckJobTask(taskIdsDto);
    }

    @Get('check-cron')
    async checkCron(@Query('cron') cron: string){
        console.log(cron)
        return await this.schedulerService.checkCron(cron);
    }
}
