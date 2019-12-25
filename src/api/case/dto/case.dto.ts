import {IsEmpty, IsJSON, IsNotEmpty, IsNumber, IsUrl, Max} from 'class-validator';

export class CreateCaseDto {

    @IsNotEmpty()
    readonly name: string;

    @IsJSON()
    readonly header: string = '{}';

    @IsJSON()
    readonly param: string = '{}';

    @IsNotEmpty()
    @IsUrl()
    readonly url: string;

    readonly type: string;

    @IsNotEmpty()
    catalogId: number;

}


export class UpdateCaseDto {

    @IsNotEmpty()
    id: number;

    readonly name: string;

    @IsJSON()
    readonly header: string = '{}';

    @IsJSON()
    readonly param: string = '{}';

    @IsUrl()
    readonly url: string;

    readonly type: string;

    catalogId: number;

}
