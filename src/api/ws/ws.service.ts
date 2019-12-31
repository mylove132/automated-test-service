import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse} from '@nestjs/websockets';
import {Server} from 'socket.io';

@WebSocketGateway(3002)
export class WsService{

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('events')
    async runCaseList(@MessageBody() data: any): Promise<Object>{
        const envIds: number[] = data.envIds;
        const caselistIds: number[] = data.caselistIds;

        return {envIds, caselistIds};
    }
}
