import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message, Users, Room } from '@prisma/client';
import { number } from 'joi';

@WebSocketGateway({ namespace: 'chat', cors: { origin: "http://localhost:5173" } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  // private readonly onlineUsers: Map<number, Socket> = new Map<number, Socket>();

  private readonly connectedUsers: Map<number, Socket> = new Map<number, Socket>();

  @SubscribeMessage('connect')
  handleSetup(client: Socket, userData: Users): void {
    const userId: number = userData.id;

    if (!this.connectedUsers.has(userId)) {
      this.connectedUsers.set(userId, client);
      console.log(`User ${userId} connected`);
    }
    console.log('alo?')
    client.emit('connect', userId);
  }

  @SubscribeMessage('message')
  handleClickMessage(client: Socket, message: Message): void {
    console.log('sent message', message);
    this.server.emit('sendMessage', message);
    // this.server.emit('sortChats')
  }

  @SubscribeMessage('roomMembers')
  handleRoomMembers(client: Socket, user: Users): void {
    console.log('Dkhol a ',user);
    this.server.emit('members', user);
  }

  @SubscribeMessage('removeRoomMembers')
  handleRemoveRoomMembers(client: Socket, user: Users): void {
    console.log('Khrroj 3liya ',user);
    this.server.emit('removeMembers', user);
  }

  @SubscribeMessage('createRoom')
  handleRoomCreation(client: Socket, room: Room, userId: number): void {
    console.log('creati ', room, userId);

    // Get the specific user's socket connection using their userId
    const userSocket = this.connectedUsers.get(userId);

    if (userSocket) {
      // Emit the 'newRoom' event to the specific user
      userSocket.emit('newRoom', room);
    } else {
      console.log(`User with ID ${userId} is not connected.`);
      // Handle the case where the user is not connected
      // You can emit an error event or handle it in your application logic
    }
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeft(client: Socket, room: Room): void {
    console.log('leavi ', room);
    this.server.emit('leavingRoom', room);
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
