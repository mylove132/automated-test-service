import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ConfigService } from "../../config/config.service";
import * as fs from 'fs';
import { exec } from 'child_process';
import { Server } from 'socket.io';
import { findJmeterById, updateJmeterMd5ById, saveJmeterResult } from 'src/datasource/jmeter/jmeter.sql';
import { InjectRepository } from '@nestjs/typeorm';
import { JmeterEntity } from './jmeter.entity';
import { Repository } from 'typeorm';
import { CommonUtil } from 'src/utils/common.util';
import * as crypto from "crypto";
import { JmeterResultEntity } from './jmeter_result.entity';
import { JmeterRunStatus } from 'src/config/base.enum';

@WebSocketGateway(3001, {namespace: 'jmeter'})
export class JmeterGateway {

    @WebSocketServer() server: Server;
    config = new ConfigService(`env/${process.env.NODE_ENV}.env`);

    constructor(@InjectRepository(JmeterEntity)
    private readonly jmeterRepository: Repository<JmeterEntity>,
        @InjectRepository(JmeterResultEntity)
        private readonly jmeterResultRepository: Repository<JmeterResultEntity>, ) { }

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

        let newJmeter: JmeterEntity;
        //更新md5值
        const md5 = crypto.createHmac("sha256", new Date() + CommonUtil.randomChar(10)).digest("hex");
        const newJmxPath = this.config.jmeterJmxPath + `/${md5}.jmx`;
        fs.copyFileSync(this.config.jmeterJmxPath + `/${jmeter.md5}.jmx`, newJmxPath);
    
        await updateJmeterMd5ById(this.jmeterRepository, md5, jmeter.id);
        newJmeter = await findJmeterById(this.jmeterRepository, jmeter.id);

        const cmd = `${jmeterBinPath} -n -t ${jmeterJmxPath}/${newJmeter.md5}.jmx -Jconcurrent_number=${jmeterCountNum} -Jduration=${preCountTime} -Jcycles=${loopNum} -j ${jmeterLogPath}/${newJmeter.md5}.log -l ${jmeterJtlPath}/${newJmeter.md5}.jtl ${remote_address}`;
        console.log(cmd)
        let flag = true;
        const child = exec(cmd, {killSignal: "SIGINT"}, async (error, stdout, stderr) => {
            if (error) {
                flag = false;
                this.server.emit('message', {code: 80001, msg: error.stack});
                const jmeterResult = new JmeterResultEntity();
                jmeterResult.jmeter = newJmeter;
                jmeterResult.md5 = newJmeter.md5;
                jmeterResult.jmeterRunStatus = JmeterRunStatus.FAIL;
                await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
                child.kill("SIGINT");
            }
        });

        child.stdout.on("data", (data) => {
            this.server.emit('message', {code: 0, msg: data});
        });

        child.stdout.on("close", async () => {
            if (flag) {
                const jmeterResult = new JmeterResultEntity();
                jmeterResult.jmeter = newJmeter;
                jmeterResult.md5 = newJmeter.md5;
                jmeterResult.jmeterRunStatus = JmeterRunStatus.FINISH;
                await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
            }
            this.server.emit('message', {code: 80000, msg: `end`});
        });

    }
}