import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import {catchError, map} from "rxjs/operators";
import { Logger } from "../../utils/log4js";
import { Reflector } from "@nestjs/core";
import { OperateService } from "../../api/operate/operate.service";
import { OperateEntity } from "../../api/operate/operate.entity";
import { ApiErrorCode } from "../enums/api.error.code";
import {OperateModule, OperateType} from "../../config/base.enum";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector,
              private readonly operateService: OperateService) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map(data => {
        const res = {
          code: ApiErrorCode.SUCCESS,
          msg: "success",
          data
        };
        this.doLog(context, res);

        const operate_module = this.reflector.get<OperateModule>("operate_module", context.getHandler());
        const operate_type = this.reflector.get<OperateType>("operate_type", context.getHandler());
        const operate_desc = this.reflector.get<string>("operate_desc", context.getHandler());
        if (!operate_module || !operate_type) {
          return res;
        }
        const operate = new OperateEntity();
        operate.operateModule = operate_module;
        operate.operateType = operate_type;
        operate.operateDesc = operate_desc;
        operate.operateIp = this.getClientIp(req);
        operate.operateUri = req.originalUrl;
        operate.requestParam = JSON.stringify(req.body);
        operate.responseParam = JSON.stringify(data);
        operate.user = req.user;
        this.operateService.createOperate(operate).then(
        )
        return res;
      })
    );
  }

  doLog(context: ExecutionContext, res): void {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { url, headers, method, body } = request;
    const ua = headers["user-agent"];

    Logger.info(
      `[${request.headers.requestid}] ${method} ${url} ${ua} ${JSON.stringify(body)} ${JSON.stringify(res)} [${request.user == null ? '' : request.user.username}]`
    );
  }

  getClientIp(req) {
    const ip = req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    return ip;
  };

}
