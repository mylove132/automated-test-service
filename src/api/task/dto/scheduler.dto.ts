import {ArrayMinSize, IsArray, IsNotEmpty, IsNumber} from 'class-validator';

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

    @ArrayMinSize(1,{message: "删除的md5不能为空"})
    @IsArray()
    md5List: string[];
}

export class CheckCronDto {

    @IsNotEmpty()
    cron: string;

}
