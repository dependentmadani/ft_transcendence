import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { log } from 'console';
import { array } from 'joi';
import { Server, Socket } from 'socket.io';
import { Message, Users } from '@prisma/client';


//@WebSocketGateway()
@WebSocketGateway({namespace: 'chat', cors: { origin: "http://localhost:5173" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // private onlineUsers: Map<string, string> = new Map()
  private readonly onlineUsers: Map<number, string> = new Map<number, string>();

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    // console.log(`Client connected: ${client.id}`);

    client.on('setup', (userData) => {
      const userId = userData.userId;

      if (!this.onlineUsers.has(userId)) {
        this.onlineUsers.set(userId, client.id);
        console.log(`User ${userId} connected`);
      }

      console.log('L ONLINE USERS', this.onlineUsers)

      client.emit('connected');
  });

  }

  handleDisconnect(client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);

    // Remove the user from the onlineUsers map when they disconnect
    const disconnectedUserId = [...this.onlineUsers.entries()]
      .find(([key, value]) => value === client.id)?.[0];

    if (disconnectedUserId) {
      this.onlineUsers.delete(disconnectedUserId);
      console.log(`User ${disconnectedUserId} disconnected`);
    }
  }
  

  // handleConnection(client: Socket) {
  //   console.log(`${client.id} connected..`);
  //   this.onlineUsers.set(client.id, 'a_user')
  //   this.updateOnlineUsers
  // }
  // handleConnection(client: Socket) {
  //   console.log(`${client.id} connected..`);
  //   // You can store user ID associated with socket ID
  //   // this.onlineUsers.set(client.id, 'user123');
  //   // this.updateOnlineUsers();
  // }

  // handleDisconnect(client: Socket) {
  //   console.log(`${client.id} disconnected..`);
  // }

  // @SubscribeMessage('sendMessage')
  // newMessage(@MessageBody() data: string, client: any, payload: any) {
  //   // this.server.emit('receivedMessage', data);
  //   this.server.emit('receiveMessage', data)
  // }

  // @SubscribeMessage('setup')
  // setup(client: Socket , userData: any) {
  //   client.join('1')
  //   console.log(`user ${'1'}: joined the server..`)
  //   client.emit('connected');
  // }
  
  // @SubscribeMessage('joinChat')
  // joinChat(client: Socket, room: any) {
  //   // this.server.emit('receivedMessage', data);
  //   client.join(room)
  //   console.log(`user ${client.id}: joined room ${room}`)
  // }

  // @SubscribeMessage('newMessage')
  // newMessage(client: Socket, newMessageReceived: any) {
  //   // const chat = newMessageReceived.chatId
  //   // this.server.emit('receivedMessage', data);
  //   this.server.emit('message received', newMessageReceived)
  //   // console.log(`user ${client.id}: joined room ${room}`)
  // }

  // updateOnlineUsers() {
  //   const onlineUserIds = Array.from(this.onlineUsers.values());
  //   this.server.emit('onlineUsers', onlineUserIds);
  // }

  // @SubscribeMessage('sendMessage')
  // handleMessage(client: any, message: string) {
  //   // Save message to database and emit to the room
  //   this.server.to('2').emit('message received', message);
  // }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: Message): void {
    console.log(message)
    this.server.emit('message', message);
  }

  @SubscribeMessage('roomMembers')
  handleRoomMembers(@MessageBody() user: Users): void {
    console.log(user)
    this.server.emit('roomMembers', user);
  }
}
