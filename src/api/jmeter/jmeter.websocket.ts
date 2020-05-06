import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ConfigService } from "../../config/config.service";
import { exec } from 'child_process';
import { Server } from 'socket.io';
import { findJmeterById, saveJmeterResult } from 'src/datasource/jmeter/jmeter.sql';
import { InjectRepository } from '@nestjs/typeorm';
import { JmeterEntity } from './jmeter.entity';
import { Repository } from 'typeorm';
import { CommonUtil } from 'src/utils/common.util';
import * as crypto from "crypto";
import { JmeterResultEntity } from './jmeter_result.entity';
import { JmeterRunStatus } from 'src/config/base.enum';
import * as fs from 'fs';
import { HttpService } from '@nestjs/common';
@WebSocketGateway(3001, {namespace: 'jmeter', origins:'*:*'})
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
        const jmeterJmxPath = this.config.jmeterJmxPath;
        const jmeterLogPath = this.config.jmeterLogPath;

        const jmeter = await findJmeterById(this.jmeterRepository, data.id);
        const jmeterCountNum = jmeter.preCountNumber;
        const preCountTime = jmeter.preCountTime;
        const loopNum = jmeter.loopNum;
        const remote_address = jmeter.remote_address == null ? '' : '-R ' + jmeter.remote_address;

       
        //创建临时jmx文件
        const md5 = crypto.createHmac("sha256", new Date() + CommonUtil.randomChar(10)).digest("hex");
        const tmpJmxtFilePath = '/tmp/'+md5+'.jmx';
        fs.writeFileSync(tmpJmxtFilePath, this.httpService.get(jmeter.url));
        //构建命令行
        const cmd = `${jmeterBinPath} -n -t ${jmeterJmxPath}/${tmpJmxtFilePath} -Jconcurrent_number=${jmeterCountNum} -Jduration=${preCountTime} -Jcycles=${loopNum} -j ${jmeterLogPath}/${md5}.log -l ${jmeterJtlPath}/${md5}.jtl ${remote_address}`;
        console.log(cmd)
        let flag = true;
        //执行命令行
        const child = exec(cmd, {killSignal: "SIGINT"}, async (error, stdout, stderr) => {
            if (error) {
                flag = false;
                this.server.emit('message', {code: 80001, msg: error.stack});
                const jmeterResult = new JmeterResultEntity();
                jmeterResult.jmeter = jmeter;
                jmeterResult.md5 = md5;
                jmeterResult.jmeterRunStatus = JmeterRunStatus.FAIL;
                await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
                child.kill("SIGINT");
            }
        });

        //监听返回记录
        child.stdout.on("data", (data) => {
            this.server.emit('message', {code: 0, msg: data});
        });

        //监听结束
        child.stdout.on("close", async () => {
            if (flag) {
                const jmeterResult = new JmeterResultEntity();
                jmeterResult.jmeter = jmeter;
                jmeterResult.md5 = md5;
                jmeterResult.jmeterRunStatus = JmeterRunStatus.FINISH;
                await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
            }
            fs.unlinkSync(tmpJmxtFilePath);
            this.server.emit('message', {code: 80000, msg: `end`});
        });

    }
}