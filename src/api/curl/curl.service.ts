import { Injectable, HttpService } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { AxiosRequestConfig } from 'axios';
import { mergeScan, last } from 'rxjs/operators';


@Injectable()
export class CurlService {
  constructor(private httpService: HttpService) {}

  /**
   * 验证返回结果是否正常返回
   * @param {params} : get请求参数
   * @return {{[propsName: string]: any}}: get参数拼接成的字符串
   */
  private verifyMiddleWare(res: any): boolean {
    if (+res.code === 10000) {
      return true;
    } else {
      return false;
    }
  }
	
	/**
   * 通用的request请求
   * @param {config}: request请求配置信息
   * @return {any}:
   */
	makeRequest(config: AxiosRequestConfig): Observable<any> {
		return this.httpService.request(config).pipe(
      map(res => {
        return this.verifyMiddleWare(res) ? { result: true, data: res } : { result: false, data: res };
      }),
			catchError(error => of(`失败的请求: ${error}`)),
		);
	}
	/**
   * 单线流程request请求
   * @param {config[]}: request请求配置信息的数组
   * @return {any}:
	 * @example:
	 * const source = of(...[1, 2, 3, 4, 5]);
	 * const example = source.pipe(mergeScan((acc, curr) => {
	 * 			return of(curr)
	 * 		}, null), last())
	 * .subscribe(res => console.log(res)) // 5
   */
	queryRequestList(configList: Array<AxiosRequestConfig>): Observable<any> {
		return of(...configList)
		.pipe(
			mergeScan((acc, current) => {
				return this.makeRequest(current)
			}, null), 
			last()
		)
		.pipe(map(res => res.data), catchError(error => of(`失败的请求: ${error}`)))
	}
}
