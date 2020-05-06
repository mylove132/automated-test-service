import {IsArray, IsNotEmpty, IsOptional, IsNumber, IsUrl} from "class-validator";

export class CreateJmeterDto {

    @IsUrl()
    url: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    preCountNumber: number;

    @IsNotEmpty()
    preCountTime: number;

    @IsNotEmpty()
    loopNum: number;

    @IsOptional()
    remote_address: string;

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

    @IsOptional()
    remote_address: string;

}

export class JmeterIdsDto {

    @IsArray()
    ids: number[];
}

export class JmeterIdDto {

    @IsNumber()
    id: number;
}