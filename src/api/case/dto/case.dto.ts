import { IsJSON, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUrl} from 'class-validator';

export class CreateCaseDto {

    @IsNotEmpty()
    readonly name: string;

    @IsJSON()
    @IsOptional()
    readonly header: string;

    @IsJSON()
    @IsOptional()
    readonly param: string;

    @IsNotEmpty()
    @IsUrl()
    readonly url: string;

    @IsNumberString()
    @IsOptional()
    readonly type: string;

    @IsNotEmpty()
    catalogId: number;

}

export class UpdateCaseDto {

    @IsNotEmpty()
    id: number;

    @IsString()
    @IsOptional()
    readonly name: string;

    @IsJSON()
    @IsOptional()
    readonly header: string;

    @IsJSON()
    @IsOptional()
    readonly param: string;

    @IsUrl()
    @IsOptional()
    readonly url: string;

    @IsNumberString()
    @IsOptional()
    readonly type: string;

    @IsOptional()
    catalogId: string;

}
