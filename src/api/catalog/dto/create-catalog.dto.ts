import {IsNotEmpty} from "class-validator";

export class CreateCatalogDto {

  @IsNotEmpty()
  readonly name: string;

  readonly parentId: number;

  @IsNotEmpty()
  readonly userId: number;
}
