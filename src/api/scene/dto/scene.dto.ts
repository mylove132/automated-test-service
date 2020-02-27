import {IsNotEmpty, IsNumber, IsOptional, IsNumberString, IsString, IsJSON, IsDate} from 'class-validator';
import {Optional} from "@nestjs/common";

export class CreateSceneDto {

    @IsNotEmpty()
    name: string;

    @Optional()
    desc: string;

    @IsNumber()
    @IsNotEmpty()
    catalogId: number;

    @IsJSON()
    caseList: string;
}
