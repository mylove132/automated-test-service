import {ApiBearerAuth, ApiUseTags} from '@nestjs/swagger';
import {Body, Controller, Post} from '@nestjs/common';
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

    async getAllJobs(){

    }
}
