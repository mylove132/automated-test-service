import { IsJSON, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUrl} from 'class-validator';
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

    @IsNumberString()
    @IsOptional()
    readonly type: string;

    @IsNotEmpty()
    catalogId: number;

    @IsNumberString()
    @IsOptional()
    paramType: string;

    @IsNotEmpty()
    assertText: string;

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

}
