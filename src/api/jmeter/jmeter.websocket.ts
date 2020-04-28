import { SubscribeMessage, WebSocketGateway, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'
import {ConfigService} from "../../config/config.service";
import * as fs from 'fs';
import { ApiErrorCode } from 'src/shared/enums/api.error.code';

@WebSocketGateway(3001)
export class JmeterGateway {
    
    @WebSocketServer() server;
    config = new ConfigService(`env/${process.env.NODE_ENV}.env`);

    @SubscribeMessage('jmeter')
    onEvent(client: any, payload: any): Observable<WsResponse<any>> | any {
      
      let num = 0;
      let { md5 } = payload;
      while(!fs.existsSync(this.config.jmeterJtlPath+`/${md5}.jtl`)){
          num++;
          if (num > 100){
              return {code: ApiErrorCode.JTL_FILE_UNEXIST, msg: 'jtl文件未存在'}
          }
      }
      const content = fs.readFileSync(this.config.jmeterJtlPath+`/${md5}.jtl`, {encoding: 'utf-8',flag: 'r'});
      return content;
    }
  
}