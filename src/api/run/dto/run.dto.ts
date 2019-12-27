import { IsString, IsJSON, IsNotEmpty, IsUrl, IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { ParamType } from '../../case/dto/http.enum';

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

export class RunCaseByIdDto{
    @IsNotEmpty()
    @IsNumber()
    readonly caseId: number;

    @IsNotEmpty()
    @IsNumber()
    readonly envId: number;
}