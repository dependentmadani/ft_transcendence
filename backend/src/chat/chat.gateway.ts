import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message, Users } from '@prisma/client';

@WebSocketGateway({ namespace: 'chat', cors: { origin: "http://localhost:5173" } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  // private readonly onlineUsers: Map<number, Socket> = new Map<number, Socket>();

  @SubscribeMessage('connect')
  handleSetup(client: Socket, userData: Users): void {
    // const userId = userData.id;

    // if (!this.onlineUsers.has(userId)) {
    //   this.onlineUsers.set(userId, client);
    //   console.log(`User ${userId} connected`);
    // }

    client.emit('connect', userData.id);
  }

  @SubscribeMessage('message')
  handleClickMessage(client: Socket, message: Message): void {
    console.log('sent message', message);
    this.server.emit('sendMessage', message);
  }

  @SubscribeMessage('roomMembers')
  handleRoomMembers(client: Socket, user: Users): void {
    console.log(user);
    this.server.emit('roomMembers', user);
  }

  // handleDisconnect(client: Socket): void {
  //   const disconnectedUserId = [...this.onlineUsers.entries()]
  //     .find(([key, value]) => value === client)?.[0];

  //   if (disconnectedUserId) {
  //     this.onlineUsers.delete(disconnectedUserId);
  //     console.log(`User ${disconnectedUserId} disconnected`);
  //   }
  // }
}
