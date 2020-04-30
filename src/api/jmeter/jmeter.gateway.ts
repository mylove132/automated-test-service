import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Client, Server } from 'socket.io';

@WebSocketGateway()
export class TestGateway implements 
    OnGatewayInit, 
    OnGatewayConnection, 
    OnGatewayDisconnect { // 实现生命周期的接口

    constructor() { }

    @WebSocketServer()
    server: Server // server实例,在这里即namespace为'/'的server

    //#region 生命周期事件

    // 初始化
    afterInit(server: Server) {
    
    }
    
    // 连接
    handleConnection(client: Client) {

    }
    
    // 断开连接
    handleDisconnect(client: Client) {

    }

    //#endregion

    // 注册事件
    @SubscribeMessage('event')
    handle(client: Client, roomId: string) {
        this.server.emit('event', 'data.username') // 在当前命名空间下广播事件
        return 'Hello World!' // 客户端接收的消息
    }
}