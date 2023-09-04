import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors: {
  origin: 'localhost:8000/*'
}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {

  }

  handleDisconnect(client: Socket) {

  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

}
