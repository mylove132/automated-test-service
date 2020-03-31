import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray, IsBoolean,
    IsJSON,
    IsNotEmpty,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsString,
    IsUrl,
    MinLength
} from 'class-validator';
import {Optional} from '@nestjs/common';
import {ParamType, RequestType} from "./http.enum";

export class CreateCaseDto {

    @IsNotEmpty()
    readonly name: string;

    @IsJSON()
    @IsOptional()
    readonly header: string;

    @IsJSON()
    @IsOptional()
    readonly param: string;

    @IsOptional()
    @IsUrl()
    readonly endpoint: string;

    @IsNotEmpty()
    readonly path: string;

    @IsNumber()
    @IsOptional()
    readonly type: RequestType;

    //接口等级
    @IsNumber()
    @IsOptional()
    readonly caseGrade: CaseGrade;

    //用例类别
    @IsNumber()
    @IsOptional()
    readonly caseType: CaseType;

    @IsNotEmpty()
    catalogId: number;

    @IsNumber()
    @IsOptional()
    paramType: ParamType;

    @IsNotEmpty()
    assertText: string;

    @IsNotEmpty()
    endpointId: number;

    @IsString()
    assertKey: string;

    @IsNumber()
    assertType: number;

    @IsNumber()
    assertJudge: number;

    @Optional()
    alias: string;

    @Optional()
    tokenId: number;

    @Optional()
    isFailNotice?: boolean;
}

export class UpdateCaseDto {

    @IsNotEmpty()
    id: number;

    @IsString()
    @IsOptional()
    readonly name: string;

    @IsJSON()
    @IsOptional()
    readonly header: string;

    @IsJSON()
    @IsOptional()
    readonly param: string;

    @IsOptional()
    readonly path: string;

    @IsOptional()
    readonly endpoint: string;

    //接口等级
    @IsNumber()
    @IsOptional()
    readonly caseGrade: CaseGrade;

    //用例类别
    @IsNumber()
    @IsOptional()
    readonly caseType: CaseType;

    @IsNumber()
    @IsOptional()
    readonly type: RequestType;

    @IsOptional()
    catalogId: string;

    @IsNumberString()
    @IsOptional()
    paramType: string;

    @Optional()
    assertText: string;

    @Optional()
    endpointId: number;

    @Optional()
    assertKey: string;

    @IsNumber()
    @IsOptional()
    assertType: number;

    @IsNumber()
    @IsOptional()
    assertJudge: number;

    @Optional()
    alias: string;

    @Optional()
    tokenId: number;

    @Optional()
    isFailNotice?: boolean;

}


export class DeleteCaseDto {

    @ArrayMinSize(1,{message: "删除的ID至少为1个"})
    @ArrayMaxSize(20,{message: "删除ID数组最多一次20个"})
    @IsArray()
    ids: number[];
}


export enum CaseGrade {
    HIGH = 0, IN = 1, LOW = 2
}

export enum CaseType {
    SINGLE = 0, SCENE = 1, BLEND = 2
}
