import { IsNotEmpty, IsUrl} from 'class-validator';

export class AddEndpointDto{

    @IsNotEmpty()
    name: string;

    @IsUrl()
    @IsNotEmpty()
    endpoint: string;

    @IsNotEmpty()
    envs: string
}
