import { Controller, Post, Body, Query, Get, Delete, Put } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiUseTags } from "@nestjs/swagger";
import { SceneService } from "./scene.service";
import { CreateSceneDto, DeleteSceneByIdDto, UpdateSceneDto } from "./dto/scene.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { SceneEntity } from "./scene.entity";
import { OpeModule, OperateDesc, OpeType } from "../../utils/common.decorators";
import {OperateModule, OperateType} from "../../config/base.enum";

@ApiUseTags("scene")
@Controller("scene")
export class SceneController {
  constructor(
    private sceneService: SceneService
  ) {
  }

  @OpeModule(OperateModule.SENCE)
  @OpeType(OperateType.CREAT)
  @OperateDesc("")
  @ApiOperation({ title: "add scene", description: "添加场景用例" })
  @ApiResponse({ status: 200, description: "add scene success." })
  @Post("")
  async addSceneCrontroller(@Body() createSceneDto: CreateSceneDto): Promise<any> {
    return await this.sceneService.addSceneService(createSceneDto);
  }

  @OpeModule(OperateModule.SENCE)
  @OpeType(OperateType.UPDATE)
  @OperateDesc("")
  @ApiOperation({ title: "update scene", description: "更新场景用例" })
  @ApiResponse({ status: 200, description: "update scene success." })
  @Put("")
  async updateSceneCrontroller(@Body() updateSceneDto: UpdateSceneDto): Promise<any> {
    return await this.sceneService.updateSceneService(updateSceneDto);
  }

  @OpeModule(OperateModule.SENCE)
  @OpeType(OperateType.DELETE)
  @OperateDesc("")
  @ApiOperation({ title: "delete scene", description: "删除场景用例" })
  @ApiResponse({ status: 200, description: "delete scene success." })
  @Delete("")
  async deleteSceneCrontroller(@Body() deleteSceneByIdDto: DeleteSceneByIdDto): Promise<any> {
    return await this.sceneService.deleteSceneById(deleteSceneByIdDto);
  }

  @OperateDesc("")
  @ApiOperation({ title: "get scene", description: "获取场景" })
  @ApiResponse({ status: 200, description: "get scene success." })
  @Get("")
  async findSceneList(@Query("page") page: number = 1, @Query("limit") limit: number = 10, @Query("catalogId") catalogId?: number, @Query("sceneGrade") sceneGrade?: string): Promise<Pagination<SceneEntity>> {
    let sceneGradeList = [];
    sceneGrade == null ? sceneGradeList.push(0, 1, 2) : sceneGrade.indexOf(",") ? sceneGrade.split(",").map(grade => {
      sceneGradeList.push(Number(grade));
    }) : sceneGradeList.push(Number(sceneGrade));
    return this.sceneService.findSceneService(catalogId, sceneGradeList, { page, limit });
  }

}
