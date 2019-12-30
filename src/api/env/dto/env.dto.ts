import {ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsUrl} from 'class-validator';

export class AddEndpointDto{

    @IsNotEmpty()
    name: string;

    @IsUrl()
    @IsNotEmpty()
    endpoint: string;

    @ArrayMinSize(1)
    @IsArray()
    envs: number[]

}

export class QueryEnvDto {

    @IsArray()
    ids: number[]
}


export class QueryEndpointDto {

    @IsOptional()
    @IsArray()
    envIds: number[]
}
export class DeleteEndpointDto {

    @ArrayMinSize(1,{message: '删除的endpoint ID不能为空数组'})
    @IsArray()
    endpointIds: number[]
}
