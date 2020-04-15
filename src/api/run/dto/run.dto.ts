import {
    IsString,
    IsJSON,
    IsNotEmpty,
    IsUrl,
    IsNumber,
    IsNumberString,
    IsOptional,
    IsArray,
    IsBoolean
} from 'class-validator';
import {IRunCaseById, IRunCaseList} from '../run.interface';
import {Optional} from '@nestjs/common';
import {Executor, ParamType} from "../../../config/base.enum";


export class RunCaseDto {
    @IsNotEmpty()
    @IsUrl()
    readonly endpoint: string;

    @IsString()
    @IsOptional()
    readonly path: string;

    @IsJSON()
    @IsOptional()
    readonly header: string = '{}';

    @IsJSON()
    @IsOptional()
    readonly param: string = '{}';

    @IsOptional()
    readonly paramType: ParamType;

    @IsNumberString()
    @IsOptional()
    readonly type: string;

    @IsString()
    @IsOptional()
    assertText: string;

    @IsOptional()
    tokenId?: number;

    @Optional()
    isNeedSign: boolean;

}

export class RunCaseByIdDto implements IRunCaseById{
    @IsNotEmpty()
    @IsArray()
    readonly caseIds: number[];

    @IsNotEmpty()
    @IsNumber()
    readonly envId: number;

    @Optional()
    readonly executor: Executor;

    @Optional()
    readonly tokenId: number;

    @Optional()
    readonly isNotice?: boolean;

}
export class RunCaseListByIdDto implements IRunCaseList{
    @IsNotEmpty()
    @IsNumber()
    readonly caseListId: number;

    @IsNotEmpty()
    @IsNumber()
    readonly envId: number;

    @Optional()
    readonly executor: Executor;
}

export class CovertDto {

    @Optional()
    type: number;

    @IsUrl()
    url: string;

    @Optional()
    args: string;

    @IsOptional()
    @IsJSON()
    header: string;
}

export class RunSceneDto{

    @IsNumber()
    sceneId: number;

    @IsNumber()
    readonly envId: number;

    @Optional()
    readonly executor: Executor;
}
