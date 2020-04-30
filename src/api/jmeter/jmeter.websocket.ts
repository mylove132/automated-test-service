import { SubscribeMessage, WebSocketGateway, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators'
import {ConfigService} from "../../config/config.service";
import * as fs from 'fs';
import {exec, execSync} from 'child_process';
import { Server } from 'socket.io';
import { findJmeterById, updateJmeterMd5ById, saveJmeterResult } from 'src/datasource/jmeter/jmeter.sql';
import { InjectRepository } from '@nestjs/typeorm';
import { JmeterEntity } from './jmeter.entity';
import { Repository } from 'typeorm';
import { CommonUtil } from 'src/utils/common.util';
import { ApiException } from 'src/shared/exceptions/api.exception';
import * as crypto from "crypto";
import { ApiErrorCode } from 'src/shared/enums/api.error.code';
import { HttpStatus } from '@nestjs/common';
import { JmeterResultEntity } from './jmeter_result.entity';
import { JmeterRunStatus } from 'src/config/base.enum';

@WebSocketGateway(3001)
export class JmeterGateway {
    
    @WebSocketServer() server: Server;
    config = new ConfigService(`env/${process.env.NODE_ENV}.env`);

    constructor( @InjectRepository(JmeterEntity)
    private readonly jmeterRepository: Repository<JmeterEntity>,
                 @InjectRepository(JmeterResultEntity)
    private readonly jmeterResultRepository: Repository<JmeterResultEntity>,){}

    @SubscribeMessage('jmeter')
    async onEvent(client: any, data: any) {

        console.log('------------------'+JSON.stringify(data))
        const jmeterBinPath = this.config.jmeterBinPath;
        const jmeterJtlPath = this.config.jmeterJtlPath;
        const jmeterJmxPath = this.config.jmeterJmxPath;
        const jmeterLogPath = this.config.jmeterLogPath;

        const jmeter = await findJmeterById(this.jmeterRepository, data.id);
        const jmeterCountNum = jmeter.preCountNumber;
        const preCountTime = jmeter.preCountTime;
        const loopNum = jmeter.loopNum;
        const remote_address = jmeter.remote_address == null ? '' : '-R '+jmeter.remote_address;

        let newJmeter: JmeterEntity;
        CommonUtil.printLog1('()()()()()()())')
        //更新md5值
        if (fs.existsSync(this.config.jmeterJtlPath+`/${jmeter.md5}.jtl`)){
            console.log('-----------'+this.config.jmeterJtlPath+`/${jmeter.md5}.jtl`)
            const md5 = crypto.createHmac("sha256", new Date() + CommonUtil.randomChar(10)).digest("hex");
            const newJmxPath = this.config.jmeterJmxPath+`/${md5}.jmx`;
            fs.copyFileSync(this.config.jmeterJmxPath+`/${jmeter.md5}.jmx`, newJmxPath);
            CommonUtil.printLog1(md5)
            await updateJmeterMd5ById(this.jmeterRepository, md5, jmeter.id);
            newJmeter = await findJmeterById(this.jmeterRepository, jmeter.id);
        } else {
            newJmeter = jmeter;
        }
        const cmd = `${jmeterBinPath} -n -t ${jmeterJmxPath}/${newJmeter.md5}.jmx -Jconcurrent_number=${jmeterCountNum} -Jduration=${preCountTime} -Jcycles=${loopNum} -j ${jmeterLogPath}/${newJmeter.md5}.log -l ${jmeterJtlPath}/${newJmeter.md5}.jtl ${remote_address}`;
        exec(cmd, async (error, stdout, stderr) => {
            if (error) {
                this.server.emit('message',error.message);
                const jmeterResult = new JmeterResultEntity();
                jmeterResult.jmeter = newJmeter;
                jmeterResult.md5 = newJmeter.md5;
                jmeterResult.jmeterRunStatus = JmeterRunStatus.FAIL;
                await saveJmeterResult(this.jmeterResultRepository, jmeterResult);
                throw new ApiException(`${jmeter.name} => 执行压测失败`, ApiErrorCode.TIMEOUT, HttpStatus.PARTIAL_CONTENT);
            };
            this.server.emit('message',stdout);
        });
   }
}