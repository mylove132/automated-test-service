import {IsNotEmpty, IsNumber, IsOptional, IsNumberString, IsString, IsJSON, IsDate, IsArray} from 'class-validator';
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

    @IsNumber()
    @IsOptional()
    sceneGrade: number;
}
export class UpdateSceneDto{

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsOptional()
    name: string;

    @Optional()
    desc: string;

    @IsNumber()
    @IsOptional()
    catalogId: number;

    @IsOptional()
    @IsJSON()
    caseList: string;

    @IsNumber()
    @IsOptional()
    sceneGrade: number;

}

export class DeleteSceneByIdDto {

    @IsArray()
    @IsNotEmpty()
    sceneIds: number[];
}
