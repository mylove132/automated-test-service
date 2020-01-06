import { IsString, IsJSON, IsNotEmpty, IsUrl, IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { ParamType } from '../../case/dto/http.enum';
import {IRunCaseById, IRunCaseList} from '../run.interface';
import {Executor} from '../../history/dto/history.enum';
<<<<<<< HEAD
import {Optional} from '@nestjs/common';
=======
>>>>>>> 077999d2baa8a42278f6c7f190a304a1aa03e0da

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
<<<<<<< HEAD

    @Optional()
    readonly executor: Executor;
=======
    
    @IsOptional()
    executor: Executor;
>>>>>>> 077999d2baa8a42278f6c7f190a304a1aa03e0da
}
export class RunCaseListByIdDto implements IRunCaseList{
     @IsNotEmpty()
     @IsNumber()
    readonly caseListId: number;

    @IsNotEmpty()
     @IsNumber()
    readonly envId: number;

<<<<<<< HEAD
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
=======
    @IsOptional()
    readonly executor: Executor;

>>>>>>> 077999d2baa8a42278f6c7f190a304a1aa03e0da
}
