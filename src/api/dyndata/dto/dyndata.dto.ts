import { IsNotEmpty, IsOptional } from "class-validator";
import { Optional } from "@nestjs/common";

/**
 * 更新数据库配置
 */
export class UpdateDbDto {

    @IsOptional()
    readonly dbHost: string;

    @IsOptional()
    readonly dbPort: number;

    @IsOptional()
    readonly dbUsername: string;

    @IsOptional()
    readonly dbPassword: string;

    @IsOptional()
    readonly dbName: string;

}

/**
 * 创建sql配置
 */
export class CreateSqlDto {

    @IsNotEmpty()
    readonly sql: string;

    @IsNotEmpty()
    readonly dbId: number;

    @IsNotEmpty()
    readonly name: string;

}

/**
 * 更新sql配置
 */
export class UpdateSqlDto {

    @IsNotEmpty()
    id: number;

    @Optional()
    readonly sql: string;

    @Optional()
    readonly dbId: number;

    @Optional()
    readonly name: string;

}