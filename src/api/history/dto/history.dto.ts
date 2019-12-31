import { IsNotEmpty, IsNumber } from 'class-validator';

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
}