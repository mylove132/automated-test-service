import { Controller } from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiUseTags} from "@nestjs/swagger";
import {OperateService} from "./operate.service";

@ApiUseTags('operate')
@Controller('operate')
export class OperateController {
  constructor(
    private operateService : OperateService,
  ) {}

}
