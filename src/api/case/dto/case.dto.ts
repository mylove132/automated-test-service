import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
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

    @IsNotEmpty()
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

    @IsNumberString()
    @IsOptional()
    readonly type: string;

    @IsOptional()
    catalogId: string;

    @IsNumberString()
    @IsOptional()
    paramType: string;

    @Optional()
    assertText: string;

    @Optional()
    endpointId: number;

}


export class DeleteCaseDto {

    @ArrayMinSize(1,{message: "删除的ID至少为1个"})
    @ArrayMaxSize(20,{message: "删除ID数组最多一次20个"})
    @IsArray()
    ids: number[];
}
