import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';

 //@WebSocketGateway()
@WebSocketGateway({ cors: { origin: "http://localhost:5173" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`${client.id} connected..`);
  }

  handleDisconnect(client: Socket) {
    console.log(`${client.id} disconnected..`);
  }

  @SubscribeMessage('newMessage')
  newMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    this.server.emit('newMessage', data);
  }
}
