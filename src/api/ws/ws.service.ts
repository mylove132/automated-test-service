import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse} from '@nestjs/websockets';
import {Server} from 'socket.io';

@WebSocketGateway(3002)
export class WsService{

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('events')
    async runCaseList(@MessageBody() data: any): Promise<Object>{
        console.log(data)
        return await data;
    }
}
