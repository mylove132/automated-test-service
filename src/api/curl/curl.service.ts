import { Injectable, HttpService } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable()
export class CurlService {
  constructor(private readonly httpService: HttpService) {}
  /**
   * get参数转化成字符串拼接
   * @param {params} : get请求参数
   * @return {{[propsName: string]: any}}: get参数拼接成的字符串
   */
  private paramsToStr(params: { [propsName: string]: any }): string {
    if (!params || !Object.keys(params)) {
      return '';
    }
    return Object.keys(params)
      .map(item => `${item}=${params[item]}`)
      .join('&');
  }

  /**
   * http get请求
   * @param {url} : url地址
   * @param {params} : get请求参数
   * @return: 
   */
  get(url: string, params?: {[propsName: string]: any }): Observable<any> {
    const formatUrl = url.endsWith('?')
    ? `${url}${this.paramsToStr(params)}`
    : `${url}?${this.paramsToStr(params)}`;
    
    return this.httpService.get(formatUrl).pipe(
      map(res => res.data),
      timeout(5000),
      catchError(error => of(`失败的请求: ${error}`)),
    );
  }

  /**
   * http post请求
   * @param {url} : url地址
   * @param {data} : post提交的数据
   * @return:
   */
  post(url: string, data: {[propsName: string]: any }): Observable<any> {
    return this.httpService.post(url, data).pipe(
      map(res => res.data),
      catchError(error => of(`失败的请求: ${error}`)),
    );
  }
}