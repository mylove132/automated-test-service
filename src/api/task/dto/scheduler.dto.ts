import {ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import {Optional} from "@nestjs/common";
import {CaseGrade, Executor} from "../../../config/base.enum";
import {IRunCaseById} from "../../run/run.interface";


class TaskIdsDto {
    @ArrayMinSize(1, {message: "id集合不能为空"})
    @IsArray()
    ids: number[];
}


class SingleTaskDto {

    @IsNumber({allowNaN: true})
    readonly envId: number;

    @IsNotEmpty()
    cron: string;

    @IsNotEmpty()
    name: string;

    //任务类型
    @Optional()
    caseGrade: CaseGrade;

    @Optional()
    isSendMessage: boolean;

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
    RunCaseListDto, UpdateTaskDto, SingleTaskDto, TaskIdsDto
}
