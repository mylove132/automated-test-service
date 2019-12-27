import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {Body, Controller, Delete, Get, Post, Query} from '@nestjs/common';
import {AddCaselistTaskDto} from './dto/scheduler.dto';
import {SchedulerService} from './scheduler.service';

ApiBearerAuth()
@ApiUseTags('定时任务')
@Controller('scheduler')
export class SchedulerController {

    constructor(private readonly schedulerService: SchedulerService) {}

    @Post('')
    async startTask(@Body() addCaselistTaskDto: AddCaselistTaskDto){
        return await this.schedulerService.startTask(addCaselistTaskDto);
    }

    @Get('running')
    async getAllJobs(){
        return this.schedulerService.getAllJobs();
    }

    @Delete('running')
    async deleRunnigJobs(@Query('md5s')md5s: string){
        return this.schedulerService.deleteJob(md5s);
    }

    @Get('stop')
    async stopJobs(@Query('md5s') md5s: string){
        return this.schedulerService.stopJob(md5s);
    }

    @Get('stop_system_task')
    async stopSystemTaskJob(){
        return this.schedulerService.delCheckJobTask();
    }

    @Get('restart_system_task')
    async restartSystemTaskJob(){
        return this.schedulerService.delCheckJobTask();
    }
}
