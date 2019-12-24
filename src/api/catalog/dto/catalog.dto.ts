import {IsBoolean, IsNotEmpty} from 'class-validator';

export class CreateCatalogDto {

  @IsNotEmpty()
  readonly name: string;

  readonly parentId: number;

  @IsNotEmpty()
  readonly userId: number;

  readonly isPub: string;
}

export class QueryCatalogDto {

  readonly userId: number;

  readonly isPub: string;
}

export class DeleteCatalogDto {

  @IsNotEmpty()
  readonly catalogIds: number[];
}

export class UpdateCatalogDto{

  @IsNotEmpty()
  readonly id: number;

  readonly name: string;

  readonly isPub: string;

}
