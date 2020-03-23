import {ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';
import {CaseGrade, CaseType} from "../../case/dto/case.dto";
import {TaskType} from "./run.status";
import {Optional} from "@nestjs/common";


export class TaskIdsDto {

    @ArrayMinSize(1,{message: "id集合不能为空"})
    @IsArray()
    ids: number[];
}




export class SIngleTaskDto{

    @IsNumber()
    @IsNotEmpty()
    readonly caseType: CaseType;

    @IsNumber({allowNaN:true})
    readonly envId: number;

    @IsNotEmpty()
    cron: string;

    @IsNotEmpty()
    name: string;

    //任务类型
    @Optional()
    taskType: TaskType;

    //任务类型
    @Optional()
    caseGrade: CaseGrade;

}

export class UpdateTaskDto{

    //任务类型
    @Optional()
    taskType: TaskType;

    @IsNotEmpty()
    id: number;

   @IsOptional()
    readonly caseGrade: CaseGrade;

    @IsNumber()
    @IsOptional()
    readonly caseType: CaseType;

    @IsOptional()
    readonly envId: number;

    @IsOptional()
    cron: string;

    @IsOptional()
    name: string;

    @IsOptional()
    isRestart: boolean = false;

}
