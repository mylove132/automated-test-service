import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../../utils/log4js';
import {ApiException} from "../exceptions/api.exception";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception.toString()} \n  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    `;
    Logger.info(logFormat);
    if (exception instanceof ApiException) {
      response
          .status(status)
          .json({
            errorCode: exception.getErrorCode(),
            errorMessage: exception.getErrorMessage(),
            date: new Date().toLocaleDateString(),
            path: request.url,
          });
    }else {
        response.status(status).json({
            statusCode: status,
            error: exception.message,
            msg: `${status >= 500 ? 'Service Error' : 'Client Error'}`,
        });
    }

  }
}
