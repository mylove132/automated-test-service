import {IsArray, IsBoolean, IsNotEmpty} from 'class-validator';

export class CreateCatalogDto {

  @IsNotEmpty()
  readonly name: string;

  readonly parentId: number;

  @IsNotEmpty()
  readonly userId: number;

  readonly isPub: string;
}
export class UpdateCatalogDto{

  @IsNotEmpty()
  readonly id: number;

  readonly name: string;

  readonly isPub: string;

}

export class QueryCatalogDto {

  @IsArray()
  ids: number[];
}
