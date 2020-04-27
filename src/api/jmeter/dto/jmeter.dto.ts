import {IsArray, IsNotEmpty, IsOptional} from "class-validator";

export class CreateJmeterDto {


    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    md5: string;

    @IsNotEmpty()
    preCountNumber: number;

    @IsNotEmpty()
    preCountTime: number;

    @IsNotEmpty()
    loopNum: number;

}


export class UpdateJmeterDto {


    @IsNotEmpty()
    id: number;

    @IsOptional()
    name: string;

    @IsOptional()
    preCountNumber: number;

    @IsOptional()
    preCountTime: number;

    @IsOptional()
    loopNum: number;

}

export class DeleteJmeterDto {

    @IsArray()
    ids: number[];
}
