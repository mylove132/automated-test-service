/**
 * 捕获所有异常
 */
import { ExceptionFilter, Catch, HttpException, HttpStatus, ArgumentsHost } from "@nestjs/common";
import { Logger } from "../../utils/log4js";
import { ApiException } from "../exceptions/api.exception";
import { OperateService } from "../../api/operate/operate.service";
import { ExceptionEntity } from "../../api/operate/expection.entity";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly operateService: OperateService) {
  }

  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const exceptionObj = new ExceptionEntity();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
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
        errorMessage: exception.stack,
        date: new Date().toLocaleDateString(),
        path: request.url
      });

  }

  doLog(request, data): void {
    const { url, headers, method, body } = request;
    const ua = headers["user-agent"];
    console.log(data.stack);
    Logger.error(
      `[${request.headers.requestid}] ${method} ${url} ${ua} ${JSON.stringify(body)} ${data.stack} [${request.user.username}]`
    );
  }
}
