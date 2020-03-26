import {IsArray, IsBoolean, IsNotEmpty} from 'class-validator';

export class CreateCatalogDto {

  @IsNotEmpty()
  readonly name: string;

  readonly parentId: number;

  readonly isPub?: boolean;

  @IsNotEmpty()
  readonly platformCode: string;
}
export class UpdateCatalogDto{

  @IsNotEmpty()
  readonly id: number;

  readonly name: string;

  readonly isPub: boolean;

  readonly platformCode: string;

}

export class DeleteCatalogDto {

  @IsArray()
  ids: number[];
}
