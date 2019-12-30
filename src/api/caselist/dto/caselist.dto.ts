import {ArrayMinSize, IsArray, IsNotEmpty, IsNumber} from 'class-validator';
import {Optional} from '@nestjs/common';

export class CaseListIdsDto {

    @IsArray()
    ids: number[];
}

export class QueryCaselistDto {

    envId?: number;

    isTask?: boolean;

}

export class AddCaseListDto {

    @ArrayMinSize(1,{message:'添加用例接口ID不能少于1个'})
    @IsArray()
    caseIds: number[];

    @IsNotEmpty()
    caseListName: string;

    @Optional()
    cron: string;

    @Optional()
    desc: string;

    @IsNumber()
    envId: number;
}

export class UpdateCaseListDto {

    @IsNumber()
    id: number;

    @Optional()
    @IsArray()
    caseIds: number[];

    @Optional()
    caseListName: string;

    @Optional()
    cron: string;

    @Optional()
    desc: string;

    @Optional()
    envId: number;
}
