import { IsJSON, IsNotEmpty, IsUrl, IsNumber } from 'class-validator';

export class RunCaseDto {

    @IsNotEmpty()
    @IsUrl()
    readonly url: string;

    @IsJSON()
    readonly header: string = '{}';

    @IsJSON()
    readonly param: string = '{}';

    readonly type: string;

}
export class RunCaseByIdDto{

    @IsNotEmpty()
    @IsNumber()
    readonly caseId: number;

}