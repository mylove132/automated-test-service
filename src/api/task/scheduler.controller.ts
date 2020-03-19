import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Post, Query} from '@nestjs/common';
import {AddCaselistTaskDto, CheckCronDto, DeleteRunningTaskDto, SIngleTaskDto} from './dto/scheduler.dto';
import {SchedulerService} from './scheduler.service';
import {RunStatus} from "./dto/run.status";

ApiBearerAuth()
@ApiUseTags('定时任务')
@Controller('scheduler')
export class SchedulerController {

    constructor(private readonly schedulerService: SchedulerService) {}

    @Post('')
    async startTask(@Body() singleTaskDto: SIngleTaskDto){
        return await this.schedulerService.addRunSingleTask(singleTaskDto);
    }

    @Get('')
    async getAllJobs(@Query('status')status?:number){
        return this.schedulerService.getAllJobs(status);
    }

    @Delete('')
    async deleRunnigJobs(@Body() deleteRunningTaskDto: DeleteRunningTaskDto){
        return this.schedulerService.deleteJob(deleteRunningTaskDto);
    }

    @Get('stop')
    async stopJobs(@Body() deleteRunningTaskDto: DeleteRunningTaskDto){
        return this.schedulerService.stopJob(deleteRunningTaskDto);
    }z

    @Get('stop_system_task')
    async stopSystemTaskJob(){
        return this.schedulerService.delCheckJobTask();
    }

    @Get('restart_system_task')
    async restartSystemTaskJob(){
        return this.schedulerService.delCheckJobTask();
    }

    @Get('check-cron')
    async checkCron(@Query('cron') cron: string){
        console.log(cron)
        return await this.schedulerService.checkCron(cron);
    }
}
