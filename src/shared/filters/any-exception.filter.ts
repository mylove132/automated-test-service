/**
 * 捕获所有异常
 */
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '../../utils/log4js';
import {ApiException} from "../exceptions/api.exception";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof ApiException) {
      response
          .status(status)
          .json({
            errorCode: exception.getErrorCode(),
            errorMessage: exception.getErrorMessage(),
            date: new Date().toLocaleDateString(),
            path: request.url,
          });
    }
    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    Logger.error(logFormat);
    response.status(status).json({
      code: status,
      msg: `Service Error: ${exception}`,
    });
  }
}
