import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsJSON,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';
import {Optional} from '@nestjs/common';
import {CaseGrade, ParamType, RequestType} from "../../../config/base.enum";

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

    @IsOptional()
    readonly type: RequestType;

    //接口等级
    @IsNumber()
    @IsOptional()
    readonly caseGrade: CaseGrade;

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
    tokenId: number;

    @Optional()
    isFailNotice: boolean;

    //是否需要签名
    @Optional()
    isNeedSign: boolean;
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
    @IsOptional()
    readonly caseGrade: CaseGrade;

    @IsNumber()
    @IsOptional()
    readonly type: RequestType;

    @IsOptional()
    catalogId: string;

    @IsOptional()
    paramType: ParamType;

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
    tokenId: number;

    @Optional()
    isFailNotice: boolean;

    @Optional()
    isNeedSign: boolean;

}


export class DeleteCaseDto {
    @ArrayMinSize(1,{message: "删除的ID至少为1个"})
    @ArrayMaxSize(20,{message: "删除ID数组最多一次20个"})
    @IsArray()
    ids: number[];
}


export class BatchUpdateCatalogDto {

    @ArrayMinSize(1,{message: "更新的接口ID至少为1个"})
    @IsArray()
    caseIds: number[];

    @IsNumber()
    @IsNotEmpty()
    catalogId: number;
}
