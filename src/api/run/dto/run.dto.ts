import { IsJSON, IsNotEmpty, IsUrl } from 'class-validator';

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