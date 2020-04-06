import { SetMetadata} from '@nestjs/common';
import { OperateType,OperateModule } from "../api/operate/dto/operate.dto";

export const OpeModule = (module: OperateModule) => SetMetadata('operate_module', module);
export const OpeType = (type: OperateType) => SetMetadata('operate_type', type);
export const OperateDesc = (type: string) => SetMetadata('operate_desc', type);
