import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ApiException } from '../exceptions/api.exception';

var logger = require('log4js').getLogger("HttpExceptionFilter");
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    console.log(exception)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
     logger.error(exception);
    // console.log(exception && exception.message)
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    logger.error(exception);
    if (exception instanceof ApiException) {

      response
        .status(status)
        .json({
          errorCode: exception.getErrorCode(),
          errorMessage: exception.getErrorMessage(),
          date: new Date().toLocaleDateString(),
          path: request.url,
        });
    } else {
      response
        .status(status)
        .json({
          statusCode: status,
          date: exception,
          path: request.url,
        });
    }
  }

}
