import { SetMetadata} from '@nestjs/common';
import {OperateModule, OperateType} from "../config/base.enum";

export const OpeModule = (module: OperateModule) => SetMetadata('operate_module', module);
export const OpeType = (type: OperateType) => SetMetadata('operate_type', type);
export const OperateDesc = (type: string) => SetMetadata('operate_desc', type);
