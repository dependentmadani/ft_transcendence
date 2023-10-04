import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { log } from 'console';
// import { Server } from 'http';
import { array } from 'joi';
import { Server, Socket } from 'socket.io';

 //@WebSocketGateway()
@WebSocketGateway({ cors: { origin: "http://localhost:7173" } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers: Map<string, string> = new Map()

  // handleConnection(client: Socket) {
  //   console.log(`${client.id} connected..`);
  //   this.onlineUsers.set(client.id, 'a_user')
  //   this.updateOnlineUsers
  // }
  handleConnection(client: Socket) {
    console.log(`${client.id} connected..`);
    // You can store user ID associated with socket ID
    this.onlineUsers.set(client.id, 'user123');
    this.updateOnlineUsers();
  }

  handleDisconnect(client: Socket) {
    console.log(`${client.id} disconnected..`);
  }

  // @SubscribeMessage('sendMessage')
  // newMessage(@MessageBody() data: string, client: any, payload: any) {
  //   // this.server.emit('receivedMessage', data);
  //   this.server.emit('receiveMessage', data)
  // }

  @SubscribeMessage('setup')
  setup(client: Socket , userData: any) {
    // this.server.emit('receivedMessage', data);
    client.join('1')
    console.log(`user ${'1'}: joined the server..`)
    client.emit('connected')
  }
  
  @SubscribeMessage('joinChat')
  joinChat(client: Socket, room: any) {
    // this.server.emit('receivedMessage', data);
    client.join(room)
    console.log(`user ${client.id}: joined room ${room}`)
  }

  @SubscribeMessage('newMessage')
  newMessage(client: Socket, newMessageReceived: any) {
    // const chat = newMessageReceived.chatId
    // this.server.emit('receivedMessage', data);
    this.server.emit('message received', newMessageReceived)
    // console.log(`user ${client.id}: joined room ${room}`)
  }

  updateOnlineUsers() {
    const onlineUserIds = Array.from(this.onlineUsers.values());
    this.server.emit('onlineUsers', onlineUserIds);
  }

  // @SubscribeMessage('sendMessage')
  // handleMessage(client: any, message: string) {
  //   // Save message to database and emit to the room
  //   this.server.to('2').emit('message received', message);
  // }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any) {
  //   // Handle and process the received message
  //   // You can save it to the database and then emit it back to the client(s)
  //   this.server.emit('newMessage', payload);
  // }
}
