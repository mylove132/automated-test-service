import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Logger } from '../utils/log4js';

import { IClientQuery } from './socket.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { JmeterEntity } from '../api/jmeter/jmeter.entity';
import { Repository } from 'typeorm';
import { JmeterResultEntity } from '../api/jmeter/jmeter_result.entity';
import { HttpService } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import  io from 'socket.io';
import { findJmeterById, saveJmeterResult } from '../datasource/jmeter/jmeter.sql';
import * as crypto from "crypto";
import * as fs from 'fs';
import { exec } from 'child_process';
import { CommonUtil } from '../utils/common.util';
import { JmeterRunStatus } from '../config/base.enum';

@WebSocketGateway(3001, { namespace: 'jmeter', origins: '*:*' })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: io.Server;

  config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
  
  constructor(@InjectRepository(JmeterEntity)
    private readonly jmeterRepository: Repository<JmeterEntity>,
        @InjectRepository(JmeterResultEntity)
        private readonly jmeterResultRepository: Repository<JmeterResultEntity>,
        private httpService: HttpService, ) { }

  private getClientQuery(client: io.Socket): IClientQuery {
    return client.handshake.query as IClientQuery;
  }

  public async handleConnection(client: io.Socket) {
    const { user_id } = this.getClientQuery(client);
    Logger.info(`${user_id} - handleConnection`);
    return this.server.emit('event', { connected: user_id });
  }

  @SubscribeMessage('jmeter')
  async onEvent(client: any, data: any) {

      const jmeterBinPath = this.config.jmeterBinPath;
      const jmeterJtlPath = this.config.jmeterJtlPath;
      const jmeterLogPath = this.config.jmeterLogPath;
      const jmeterHtmlPath = this.config.jmeterHtmlPath;

      const jmeter = await findJmeterById(this.jmeterRepository, data.id);
      const jmeterCountNum = jmeter.preCountNumber;
      const preCountTime = jmeter.preCountTime;
      const loopNum = jmeter.loopNum;
      const remote_address = jmeter.remote_address == null || jmeter.remote_address == '' ? '' : '-R ' + jmeter.remote_address;


      //创建临时文件
      const md5 = crypto.createHmac("sha256", new Date() + CommonUtil.randomChar(10)).digest("hex");
      const tmpJmxtFilePath = '/tmp/' + md5 + '.jmx';
      const tmpJtlFilePath = jmeterJtlPath + '/' + md5 + '.jtl';
      const tmpLogFilePath = jmeterLogPath + '/' + md5 + '.log';
      const tmpHtmlPath = jmeterHtmlPath + '/' + md5;
      //下载文件
      const ds = await this.httpService.get(jmeter.url).toPromise();
      fs.writeFileSync(tmpJmxtFilePath, ds.data);

      //构建命令行
      const cmd = `${jmeterBinPath} -n -t ${tmpJmxtFilePath} -Jconcurrent_number=${jmeterCountNum} -Jduration=${preCountTime} -Jcycles=${loopNum} -j ${tmpLogFilePath} -l ${tmpJtlFilePath} ${remote_address} -e -o ${tmpHtmlPath}`;
      Logger.info(`压测脚本命令行：${cmd}`)
      //执行命令行
      const child = exec(cmd, { killSignal: "SIGINT" }, async (error, stdout, stderr) => {
          if (error) {
              this.server.emit('message', { code: 80001, id: data.id, msg: error.stack });
          }
      });
      //监听返回记录
      child.stdout.on("data", (data) => {
          this.server.emit('message', { code: 0, id: data.id, msg: data });
      });
      //监听结束
      child.stdout.on("close", async () => {
          if (!fs.existsSync(jmeterJtlPath + `/${md5}.jtl`)) {
              const jmeterResult = new JmeterResultEntity();
              jmeterResult.jmeter = jmeter;
              jmeterResult.md5 = md5;
              jmeterResult.jmeterRunStatus = JmeterRunStatus.FAIL;
              await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
          }
          else {
              const jmeterResult = new JmeterResultEntity();
              jmeterResult.jmeter = jmeter;
              jmeterResult.md5 = md5;
              jmeterResult.jmeterRunStatus = JmeterRunStatus.FINISH;
              await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
              //copy运行结果到远程服务器
              //const copyJtl = `scp -r ${tmpJtlFilePath}  ${jmeterJtlPath}`;
              //execSync(copyJtl);
              //删除本地的数据
              //fs.unlinkSync(tmpJtlFilePath);
          }
          //copy压测信息到远程服务器
          //const copyLog = `scp -r ${tmpLogFilePath}  ${jmeterLogPath}`;
          //execSync(copyLog);
          //删除临时生成的压测文件
          fs.unlinkSync(tmpJmxtFilePath);
          //fs.unlinkSync(tmpLogFilePath);
          this.server.emit('message', { code: 80000, id: data.id, msg: `end` });
      });

  }

  public async handleDisconnect(client: io.Socket) {
    const { user_id } = this.getClientQuery(client);
    Logger.info(`${user_id} - handleDisconnect`);
    return this.server.emit('event', { disconnected: user_id });
  }
}
