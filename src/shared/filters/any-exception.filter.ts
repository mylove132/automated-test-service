/**
 * 捕获所有异常
 */
import {ExceptionFilter, Catch, HttpException, HttpStatus, ExecutionContext, ArgumentsHost} from '@nestjs/common';
import { Logger } from '../../utils/log4js';
import {ApiException} from "../exceptions/api.exception";
import {Reflector} from "@nestjs/core";
import {OperateService} from "../../api/operate/operate.service";
import {ExceptionEntity} from "../../api/operate/expection.entity";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly operateService: OperateService) {}
    catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const exceptionObj = new ExceptionEntity();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    Logger.error(logFormat);

    if (exception instanceof ApiException) {
        exceptionObj.excName = 'ApiException';
        exceptionObj.exceptionMsg = exception.getErrorMessage();
        exceptionObj.errorCode = exception.getErrorCode();
        exceptionObj.requestIp = request.ip;
        exceptionObj.uri = request.originalUrl;
        exceptionObj.requestParam = JSON.stringify(request.body);
        exceptionObj.user = request.user;
        this.operateService.createException(exceptionObj);
      response
          .status(status)
          .json({
            errorCode: exception.getErrorCode(),
            errorMessage: exception.getErrorMessage(),
            date: new Date().toLocaleDateString(),
            path: request.url,
          });
    }else {
        exceptionObj.excName = exception.name;
        exceptionObj.exceptionMsg = exception.toLocaleString();
        exceptionObj.errorCode = status;
        exceptionObj.requestIp = request.ip;
        exceptionObj.uri = request.originalUrl;
        exceptionObj.requestParam = JSON.stringify(request.body);
        exceptionObj.user = request.user;
        this.operateService.createException(exceptionObj);
        response.status(status).json({
            code: status,
            msg: `Service Error: ${exception}`,
        });
    }
  }
}
