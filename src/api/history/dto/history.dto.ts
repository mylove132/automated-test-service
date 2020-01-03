import {IsNotEmpty, IsNumber, IsOptional, IsNumberString, IsString, IsJSON, IsDate} from 'class-validator';

export class CreateHistoryDto {

    @IsNumber()
    @IsNotEmpty()
    status: number;

    @IsNumber()
    @IsNotEmpty()
    caseId: number;

    @IsNumber()
    @IsNotEmpty()
    executor: number;

    @IsJSON()
    re: string;

    @IsDate()
    startTime: Date;

    @IsDate()
    endTime: Date;
}
