import { ApiBearerAuth, ApiUseTags } from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, Post, Put, Query, SetMetadata} from "@nestjs/common";
import { TaskIdsDto, UpdateTaskDto, AddTaskDto } from "./dto/scheduler.dto";
import { SchedulerService } from "./scheduler.service";
import { OpeModule, OperateDesc, OpeType } from "../../utils/common.decorators";
import {OperateModule, OperateType} from "../../config/base.enum";

ApiBearerAuth();

@ApiUseTags("定时任务")
@Controller("scheduler")
export class SchedulerController {

  constructor(private readonly schedulerService: SchedulerService) {
  }

  @OpeModule(OperateModule.TASK)
  @OpeType(OperateType.CREAT)
  @OperateDesc("")
  @Post("")
  async addTask(@Body() addTaskDto: AddTaskDto) {
    return await this.schedulerService.addTaskService(addTaskDto);
  }

  @OpeModule(OperateModule.TASK)
  @OpeType(OperateType.UPDATE)
  @OperateDesc("")
  @Put("")
  async updateTask(@Body() updateTaskDto: UpdateTaskDto) {
    return await this.schedulerService.updateTaskService(updateTaskDto);
  }

  @Get("")
  async getAllJobs(@Query("status")status?: number, @Query("page") page: number = 0, @Query("limit") limit: number = 10) {
    //limit = limit > 100 ? 100 : limit;
    return this.schedulerService.getAllJobsService(status, { page, limit });
  }

  @OpeModule(OperateModule.TASK)
  @OpeType(OperateType.DELETE)
  @OperateDesc("")
  @Delete("")
  async delRunningJobs(@Body() taskIdsDto: TaskIdsDto) {
    return this.schedulerService.deleteJobService(taskIdsDto);
  }

  @OpeModule(OperateModule.TASK)
  @OpeType(OperateType.STOPTASK)
  @OperateDesc("")
  @Post("stop")
  async stopJobs(@Body() taskIdsDto: TaskIdsDto) {
    return this.schedulerService.stopJobService(taskIdsDto);
  }


  @OpeModule(OperateModule.TASK)
  @OpeType(OperateType.STOPTASK)
  @OperateDesc("")
  @Get("stop_system_task")
  async stopSystemTaskJob() {
    return this.schedulerService.delCheckJobTaskService();
  }

  @OpeModule(OperateModule.TASK)
  @OpeType(OperateType.RESTARTTASK)
  @OperateDesc("")
  @Get("restart_system_task")
  async restartSystemTaskJob() {
    return this.schedulerService.restartSystemCheckJobTaskService();
  }

  @OpeModule(OperateModule.TASK)
  @OpeType(OperateType.RESTARTTASK)
  @OperateDesc("")
  @Post("restart")
  async restartTaskJob(@Body() taskIdsDto: TaskIdsDto) {
    return this.schedulerService.restartTaskService(taskIdsDto);
  }

  @OperateDesc("")
  @Get("check-cron")
  async checkCron(@Query("cron") cron: string) {
    console.log(cron);
    return await this.schedulerService.checkCronService(cron);
  }

  @Get("/taskResult")
  async getTaskResult(@Query("schedulerId") schedulerId?: number, @Query("page") page: number = 0, @Query("limit") limit: number = 10) {
    limit = limit > 100 ? 100 : limit;
    return this.schedulerService.getAllTaskResultService(schedulerId, { page, limit });
  }

  @Get("/taskResult/:id")
  @SetMetadata('isOpen', true)
  async getTaskResultById(@Param('id') id: number) {
    return this.schedulerService.getTaskResultByIdService(id);
  }

}
