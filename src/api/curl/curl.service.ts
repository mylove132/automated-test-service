import { Injectable, HttpService } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { AxiosRequestConfig } from 'axios';
import { mergeScan, last } from 'rxjs/operators';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class CurlService {
	constructor(
		private httpService: HttpService,
		private configService: ConfigService
		) { }
	/**
	 * 向钉钉群发送消息
	 *@param {message} : text钉钉消息
	 */
	 async sendDingTalkMessage(message: string) {
		const token = this.configService.dingtalkAccessToken;
		const env = this.configService.env === 'production' ? '生产' : '测试';
		const result = await this.httpService.post(`https://oapi.dingtalk.com/robot/send?access_token=${token}`, {
			msgtype: 'text',
			text: {
				content: `
					定时任务消息【${env}】\n
					${message}
				`
			}
		}).pipe(
			catchError(error => of(`钉钉消息发送失败: ${error}`)),
		).subscribe();
		return result;
	}

	/**
	 * 验证返回结果是否正常返回
	 * @param {params} : get请求参数
	 * @return {{[propsName: string]: any}}: get参数拼接成的字符串
	 */
	private verifyMiddleWare(res: any): boolean {
		if (+res.status === 200) {
			return true;
		} else {
			return false;
		}
	}
	getFile(url: string): Observable<any> {
		return this.httpService.get(url).pipe(
			// map(res => {
			// 	return this.verifyMiddleWare(res) ? res.data : '';
			// }),
			catchError(error => of(`地址加载失败: ${error}`)),
		);
	}

	/**
	 * 通用的request请求
	 * @param {config}: request请求配置信息
	 * @return {any}:
	 */
	makeRequest(config: AxiosRequestConfig): Observable<any> {
		return this.httpService.request(config).pipe(
			map(res => {
				return this.verifyMiddleWare(res) ? { result: true, data: res.data } : { result: false, data: res.data };
			}),
			catchError(error => of(`status：${error.response['status']
			} statusText：${error.response['statusText']}
			  `)),
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
