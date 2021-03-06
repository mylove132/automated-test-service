import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsJSON,
    IsNotEmpty,
    IsNumber,
     IsOptional,
    IsUrl
} from "class-validator";
import {Optional} from "@nestjs/common";


export class CreateTokenDto {

    @IsNotEmpty()
    username: string;

    @Optional()
    platformCodeId: number;

    @IsJSON()
    @IsNotEmpty()
    body: string;

    @IsNotEmpty()
    @IsUrl()
    url: string;

    @IsNumber()
    envId: number;

}

export class UpdateTokenDto {

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @Optional()
    username: string;

    @IsOptional()
    platformCodeId: number;

    @IsJSON()
    @IsOptional()
    body: string;

    @IsOptional()
    @IsUrl()
    url: string;

    @IsOptional()
    envId: number;

    @IsOptional()
    token: string;

}

export class DeleteTokenDto {

    @ArrayMinSize(1,{message: "删除的ID至少为1个"})
    @ArrayMaxSize(20,{message: "删除ID数组最多一次20个"})
    @IsArray()
    ids: number[];
}
