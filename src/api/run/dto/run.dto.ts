import { IsString, IsJSON, IsNotEmpty, IsUrl, IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { ParamType } from '../../case/dto/http.enum';
import {IRunCaseById, IRunCaseList} from '../run.interface';

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

    @IsNumberString()
    @IsOptional()
    readonly paramType: string | ParamType;

    @IsNumberString()
    @IsOptional()
    readonly type: string;

    @IsString()
    @IsOptional()
    assertText: string;
}

export class RunCaseByIdDto implements IRunCaseById{
    @IsNotEmpty()
    @IsNumber()
    readonly caseId: number;

    @IsNotEmpty()
    @IsNumber()
    readonly envId: number;
}
export class RunCaseListByIdDto implements IRunCaseList{
     @IsNotEmpty()
     @IsNumber()
    readonly caseListId: number;
    @IsNotEmpty()
     @IsNumber()
    readonly envId: number;
}
