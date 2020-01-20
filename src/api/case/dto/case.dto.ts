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
    readonly type: number;

    @IsNotEmpty()
    catalogId: number;

    @IsNumber()
    @IsOptional()
    paramType: number;

    @IsNotEmpty()
    assertText: string;

    @IsNotEmpty()
    endpointId: number;

    @IsBoolean()
    @IsOptional()
    isNeedToken: boolean;

    @IsString()
    assertKey: string;

    @IsNumber()
    assertType: number;

    @IsNumber()
    assertJudge: number;
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

    @IsNumber()
    @IsOptional()
    readonly type: number;

    @IsOptional()
    catalogId: string;

    @IsNumberString()
    @IsOptional()
    paramType: string;

    @Optional()
    assertText: string;

    @Optional()
    endpointId: number;

    @IsBoolean()
    @IsOptional()
    isNeedToken: boolean;

    @Optional()
    assertKey: string;

    @IsNumber()
    @IsOptional()
    assertType: number;

    @IsNumber()
    @IsOptional()
    assertJudge: number;

}


export class DeleteCaseDto {

    @ArrayMinSize(1,{message: "删除的ID至少为1个"})
    @ArrayMaxSize(20,{message: "删除ID数组最多一次20个"})
    @IsArray()
    ids: number[];
}
