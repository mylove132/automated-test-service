import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from '../../utils/log4js';
import {Reflector} from "@nestjs/core";
import {OperateService} from "../../api/operate/operate.service";
import {OperateEntity} from "../../api/operate/operate.entity";
import { OperateModule, OperateType } from "../../api/operate/dto/operate.dto";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector,private readonly operateService: OperateService) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(1).req;
    return next.handle().pipe(
      map(data => {
        const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${req.ip}
    User: ${JSON.stringify(req.user)}
    Response data:\n ${JSON.stringify(data)}
    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
        Logger.info(logFormat);
        Logger.access(logFormat);

          const operate_module = this.reflector.get<OperateModule>('operate_module', context.getHandler());
          const operate_type = this.reflector.get<OperateType>('operate_type', context.getHandler());
          const operate_desc = this.reflector.get<string>('operate_desc', context.getHandler());
          if (!operate_module || !operate_type){
              return {
                  data,
                  code: 0,
                  message: 'success',
              };
          }
          const operate = new OperateEntity();
          operate.operateModule = operate_module;
          operate.operateType = operate_type;
          operate.operateDesc = operate_desc;
          operate.operateIp = req.ip;
          operate.operateUri = req.originalUrl;
          operate.requestParam = JSON.stringify(req.body);
          operate.responseParam = JSON.stringify(data);
          operate.user = req.user;
          this.operateService.createOperate(operate);
          return {
              data,
              code: 0,
              message: 'success',
          };
      }),
    );
  }
}
