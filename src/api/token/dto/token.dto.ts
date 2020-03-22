import {IsJSON, IsNotEmpty, IsNumber, IsUrl} from "class-validator";

export enum TokenPlatform {
    CRM, SALE
}


export class CreateTokenDto {

    @IsNotEmpty()
    username: string;

    @IsNumber()
    tokenPlatform: TokenPlatform;

    @IsJSON()
    @IsNotEmpty()
    body: string;

    @IsNotEmpty()
    @IsUrl()
    url: string;

    @IsNumber()
    envId: number;


}
