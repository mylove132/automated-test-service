import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { Logger } from "../../utils/log4js";
import { ApiException } from "../exceptions/api.exception";
import { ExceptionEntity } from "../../api/operate/expection.entity";
import { OperateService } from "../../api/operate/operate.service";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

  constructor(private readonly operateService: OperateService) {
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionObj = new ExceptionEntity();
    const data = exception.stack;
    this.doLog(request, exception);


    exceptionObj.excName = exception instanceof ApiException ? "ApiException" : exception.name;
    exceptionObj.exceptionMsg = exception instanceof ApiException ? exception.getErrorMessage() : exception.message;
    exceptionObj.errorCode = exception instanceof ApiException ? exception.getErrorCode() : status;
    exceptionObj.requestIp = request.ip;
    exceptionObj.uri = request.originalUrl;
    exceptionObj.requestParam = JSON.stringify(request.body);
    exceptionObj.user = request.user;
    this.operateService.createException(exceptionObj);
    response
      .status(status)
      .json({
        errorCode: exceptionObj.errorCode,
        errorMessage: exceptionObj.exceptionMsg,
        date: new Date().toLocaleDateString(),
        path: request.url
      });

  }

  doLog(request: Request, data): void {
    const { url, headers, method, body } = request;
    const ua = headers["user-agent"];

    Logger.error(
      `[${request.headers.requestid}] ${method} ${url} ${ua} ${JSON.stringify(body)} ${JSON.stringify(data)}`
    );
  }
}
