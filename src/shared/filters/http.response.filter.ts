import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

var logger = require('log4js').getLogger("HttpExceptionFilter");

interface Response<T> {
  data: T;
}
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    let req = {};
    req['host'] = request.headers.host;
    req['url'] = request.url;
    req['method'] = request.method;
    req['args'] = request.args;
    logger.info(req);

    return next.handle().pipe(
      map(data => {
        logger.info(data);
        return {
          data,
          code: 0,
          message: 'success',
        };
      }),
    );
  }
}
