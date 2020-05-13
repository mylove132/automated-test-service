/* eslint-disable no-mixed-spaces-and-tabs */
import { Injectable, HttpService, HttpStatus } from '@nestjs/common';
import { of, Observable } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { AxiosRequestConfig } from 'axios';
import { mergeScan, last } from 'rxjs/operators';
import { ConfigService } from '../../config/config.service';
import { Logger } from '../../utils/log4js';
import { DynDbEntity } from '../dyndata/dyndb.entity';
import * as mysql from 'mysql';
import { DynSqlEntity } from '../dyndata/dynsql.entity';
import { CommonUtil } from 'src/utils/common.util';

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
	sendDingTalkMessage(message: string) {
		const token = this.configService.dingtalkAccessToken;
		const env = this.configService.env === 'production' ? '生产' : '测试';
		Logger.info(`发送钉钉消息环境：${env}, 发送钉钉消息：${message}`);
		const result = this.httpService.post(`https://oapi.dingtalk.com/robot/send?access_token=${token}`, {
			msgtype: 'text',
			text: {
				content: `
					定时任务消息【${env}】\n
					${message}
				`
			}
		}).pipe(catchError(error => of(`钉钉消息发送失败: ${error}`))).subscribe();
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
			catchError(error => of(`status：${error.response['status']} statusText：${error.response['statusText']}`)),
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


	/**
	 * mysql连接池配置
	 * @param dynDbEbtity 
	 */
	private createDbPool(dynDbEbtity: DynDbEntity) {
		let pool = mysql.createPool({
			database: dynDbEbtity.dbName,
			host: dynDbEbtity.dbHost,
			port: dynDbEbtity.dbPort,
			user: dynDbEbtity.dbUsername,
			password: CommonUtil.Decrypt(dynDbEbtity.dbPassword, dynDbEbtity.dbUsername)
		});
		return pool;
	}

	/**
	 * mysql查询
	 * @param dynDbEbtity 
	 * @param sql 
	 */
	query(dynSqlEntity: DynSqlEntity) {
		// const connection = this.connectDb(dynDbEbtity);
		// let result: any = {};
		//  connection.query(dynSqlEntity.sql, (error, results, fields) => {
		// 	if (error) {
		// 		throw new ApiException(`查询数据：${dynDbEbtity.dbName}, sql: ${dynSqlEntity.sql} 失败`, ApiErrorCode.QUERY_MYSQL_FAIL, HttpStatus.BAD_REQUEST);
		// 	}
		// 	Logger.info(`查询sql[${dynSqlEntity.sql}]结果：${JSON.stringify(results)}`);

		// 	let fieldList: any = [];
		// 	if (dynSqlEntity.resultFields.indexOf(',') != -1) {
		// 		fieldList = dynSqlEntity.resultFields.split(',');
		// 	}else {
		// 		fieldList.push(dynSqlEntity.resultFields);
		// 	}
		// 	for (const iterator of fieldList) {
		// 		const fd = CommonUtil.getFiledFromResult(iterator, results);
		// 		result[iterator] = fd;
		// 	}
		// });
		// console.log(`----------${JSON.stringify(result)}`)
		// return result;
		return new Promise((resolve, reject) => {
			this.createDbPool(dynSqlEntity.dynDb).getConnection((error, connection) => {
				if (error) {
					reject(error);
				} else {
					connection.query(dynSqlEntity.sql, (err, row) => {
						if (err) {
							reject(err)
						} else {
							resolve(row);
						}
						connection.release();
					});
				}
			});
		});

	}

	/**
	 * 执行sql语句
	 * @param dynDbENtity 
	 * @param sql 
	 */
	runSql(dynDbENtity: DynDbEntity, sql: string) {
		return new Promise((resolve, reject) => {
			this.createDbPool(dynDbENtity).getConnection((error, connection) => {
				if (error) {
					reject(error);
				} else {
					connection.query(sql, (err, row) => {
						if (err) {
							reject(err)
						} else {
							resolve(row);
						}
						connection.release();
					});
				}
			});
		});
	}
}
