import {ArrayMinSize, IsArray, IsNotEmpty, IsNumber} from 'class-validator';
import {CaseGrade} from "../../case/dto/case.dto";

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

export class DeleteRunningTaskDto {

    @ArrayMinSize(1,{message: "删除的id不能为空"})
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

    @IsNumber({allowNaN:true})
    readonly envId: number;

    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    cron: string;

    @IsNotEmpty()
    name: string;

}
