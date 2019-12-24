import {IsEmpty, IsJSON, IsNotEmpty, IsNumber, IsUrl} from 'class-validator';

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

    readonly type: number = 1;

    @IsNotEmpty()
    catalogId: number;

}

export class QueryCaseDto {

    readonly catalogId: number = 110;

    readonly pageSize: number = 10;

    readonly pageNumber: number = 1;
}

export class UpdateCaseDto {
    
}
