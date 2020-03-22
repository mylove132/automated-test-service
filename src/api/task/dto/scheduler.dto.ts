import {ArrayMinSize, IsArray, IsNotEmpty, IsNumber} from 'class-validator';
import {CaseGrade, CaseType} from "../../case/dto/case.dto";

export class AddCaselistTaskDto {

    @IsNotEmpty()
    @IsArray()
    readonly caseIds: number[];

    @ArrayMinSize(1)
    @IsArray()
    envIds: number[]

    @IsNotEmpty()
    cron: string;
}

export class Md5ListDto {

    md5s: Set<string>;
}

export class TaskIdsDto {

    @ArrayMinSize(1,{message: "id集合不能为空"})
    @IsArray()
    ids: number[];
}

export class CheckCronDto {

    @IsNotEmpty()
    cron: string;

}

export class SIngleTaskDto{

    @IsNumber({allowNaN:true})
    readonly caseGrade: CaseGrade;

    @IsNumber()
    @IsNotEmpty()
    readonly caseType: CaseType;

    @IsNumber({allowNaN:true})
    readonly envId: number;

    @IsNotEmpty()
    cron: string;

    @IsNotEmpty()
    name: string;

}
