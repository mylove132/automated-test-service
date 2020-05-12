import {ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import {Optional} from "@nestjs/common";
import {CaseGrade, Executor, TaskType} from "../../../config/base.enum";
import {IRunCaseById} from "../../run/run.interface";


class TaskIdsDto {
    @ArrayMinSize(1, {message: "id集合不能为空"})
    @IsArray()
    ids: number[];
}


class AddTaskDto {

    @IsNumber({allowNaN: true})
    readonly envId: number;

    @IsNotEmpty()
    cron: string;

    @IsNotEmpty()
    name: string;

    //接口等级
    @Optional()
    caseGrade: CaseGrade;

    @IsArray()
    catalogIds: number[];

    //任务类型
    @IsNotEmpty()
    taskType: TaskType;

    @Optional()
    isSendMessage: boolean;

    @IsOptional()
    @IsArray()
    jmeterIds: number[];

}

class UpdateTaskDto {

    @IsNotEmpty()
    id: number;

    @IsOptional()
    readonly envId: number;

    @IsOptional()
    cron: string;

    //任务类型
    @Optional()
    caseGrade: CaseGrade;

    @IsOptional()
    name: string;

    @Optional()
    isSendMessage: boolean;

    @IsOptional()
    isRestart: boolean = false;

    @IsOptional()
    @IsArray()
    jmeterIds: number[];

    // @IsOptional()
    // @IsArray()
    // catalogIds: number[];

}

class RunCaseListDto implements IRunCaseById {

    readonly caseIds: number[];
    readonly envId: number;
    readonly executor: Executor;

    constructor(private readonly cIds: number[], private readonly eId: number, private readonly exec: Executor) {
        this.caseIds = cIds;
        this.envId = eId;
        this.executor = exec;
    }
}

export {
    RunCaseListDto, UpdateTaskDto, AddTaskDto, TaskIdsDto
}
