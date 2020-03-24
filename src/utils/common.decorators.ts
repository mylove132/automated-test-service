import {applyDecorators, SetMetadata} from '@nestjs/common';

export const OperateModule = (moduleName: string) => SetMetadata('operate_module', moduleName);
export const OperateType = (type: string) => SetMetadata('operate_type', type);
export const OperateDesc = (type: string) => SetMetadata('operate_desc', type);

