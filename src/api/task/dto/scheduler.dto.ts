import {IsNotEmpty} from 'class-validator';
import {Optional} from '@nestjs/common';

export class AddCaselistTaskDto {

    @IsNotEmpty()
    caseListIds: string

    @Optional()
    envIds: string
}
