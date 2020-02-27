import {IsArray, IsBoolean, IsNotEmpty} from 'class-validator';

export class CreateCatalogDto {

  @IsNotEmpty()
  readonly name: string;

  readonly parentId: number;

  readonly isPub?: string;

  @IsNotEmpty()
  readonly platformCode: string;
}
export class UpdateCatalogDto{

  @IsNotEmpty()
  readonly id: number;

  readonly name: string;

  readonly isPub: string;

  readonly platformCode: string;

}

export class QueryCatalogDto {

  @IsArray()
  ids: number[];
}
