import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsNumberString,
  IsString,
  IsJSON,
  IsDate,
  IsArray,
  ArrayMinSize, ArrayMaxSize
} from "class-validator";
import { Optional } from "@nestjs/common";
import { CaseGrade } from "../../../config/base.enum";

export class CreateSceneDto {

  @IsNotEmpty()
  name: string;

  @Optional()
  desc: string;


  @IsNumber()
  @IsNotEmpty()
  catalogId: number;


  @ArrayMinSize(1, { message: "接口ID至少1个" })
  @IsArray()
  caseIds: number[];

  @IsOptional()
  sceneGrade: CaseGrade;
}

export class UpdateSceneDto {

  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  name: string;

  @Optional()
  desc: string;

  @IsNumber()
  @IsOptional()
  catalogId: number;

  @Optional()
  @IsArray()
  caseIds: number[];

  @IsNumber()
  @IsOptional()
  sceneGrade: number;

}

export class DeleteSceneByIdDto {

  @IsArray()
  @IsNotEmpty()
  sceneIds: number[];
}
