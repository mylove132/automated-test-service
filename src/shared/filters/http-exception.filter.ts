import {ExceptionFilter, Catch, ArgumentsHost, HttpException,} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../../utils/log4js';
import {ApiException} from "../exceptions/api.exception";
import {ExceptionEntity} from "../../api/operate/expection.entity";
import {OperateService} from "../../api/operate/operate.service";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

    constructor(private readonly operateService: OperateService) {}

    catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

      const exceptionObj = new ExceptionEntity();

    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception.toString()} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    Logger.info(logFormat);
    if (exception instanceof ApiException) {
        exceptionObj.excName = "ApiException";
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
        exceptionObj.excName = 'ApiException';
        exceptionObj.exceptionMsg = exception.name;
        exceptionObj.errorCode = status;
        exceptionObj.requestIp = request.ip;
        exceptionObj.uri = request.originalUrl;
        exceptionObj.requestParam = JSON.stringify(request.body);
        exceptionObj.user = request.user;
        this.operateService.createException(exceptionObj);
        response.status(status).json({
            statusCode: status,
            error: exception.message,
            msg: `${status >= 500 ? 'Service Error' : 'Client Error'}`,
        });
    }

  }
}
