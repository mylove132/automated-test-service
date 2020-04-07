import {IsNotEmpty, IsNumber, IsOptional, IsNumberString, IsString, IsJSON, IsDate} from 'class-validator';
import { Executor, RequestStatusEnum } from "../../../config/base.enum";

export class CreateHistoryDto {

    @IsNumber()
    @IsNotEmpty()
    status: RequestStatusEnum;

    @IsNumber()
    @IsNotEmpty()
    caseId: number;

    @IsNumber()
    @IsNotEmpty()
    executor: Executor;

    @IsJSON()
    re: string;

    @IsDate()
    startTime: Date;

    @IsDate()
    endTime: Date;
}
