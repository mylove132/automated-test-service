import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ConfigService } from "../../config/config.service";
import { exec } from 'child_process';
import { Server } from 'socket.io';
import { findJmeterById, saveJmeterResult } from '../../datasource/jmeter/jmeter.sql';
import { InjectRepository } from '@nestjs/typeorm';
import { JmeterEntity } from './jmeter.entity';
import { Repository } from 'typeorm';
import { CommonUtil } from '../../utils/common.util';
import * as crypto from "crypto";
import { JmeterResultEntity } from './jmeter_result.entity';
import { JmeterRunStatus } from '../../config/base.enum';
import * as fs from 'fs';
import { HttpService } from '@nestjs/common';
import { Logger } from '../../utils/log4js';
@WebSocketGateway(3001, { namespace: 'jmeter', origins: '*:*' })
export class JmeterGateway {

    @WebSocketServer() server: Server;
    config = new ConfigService(`env/${process.env.NODE_ENV}.env`);

    constructor(@InjectRepository(JmeterEntity)
    private readonly jmeterRepository: Repository<JmeterEntity>,
        @InjectRepository(JmeterResultEntity)
        private readonly jmeterResultRepository: Repository<JmeterResultEntity>,
        private httpService: HttpService, ) { }

    @SubscribeMessage('jmeter')
    async onEvent(client: any, data: any) {

        const jmeterBinPath = this.config.jmeterBinPath;
        const jmeterJtlPath = this.config.jmeterJtlPath;
        const jmeterLogPath = this.config.jmeterLogPath;

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
        //下载文件
        const ds = await this.httpService.get(jmeter.url).toPromise();
        fs.writeFileSync(tmpJmxtFilePath, ds.data);

        //构建命令行
        const cmd = `${jmeterBinPath} -n -t ${tmpJmxtFilePath} -Jconcurrent_number=${jmeterCountNum} -Jduration=${preCountTime} -Jcycles=${loopNum} -j ${tmpLogFilePath} -l ${tmpJtlFilePath} ${remote_address}`;
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
}