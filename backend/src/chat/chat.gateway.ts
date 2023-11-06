import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message, Users, Room } from '@prisma/client';
import { number } from 'joi';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: 'chat', cors: { origin: "http://localhost:5173" } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  socketMap: Map<number, Socket[]>;

  constructor( private prismaService: PrismaService ) {}

  private userSocketMap = new Map<number, string>();

  handleConnection(client: Socket): void {

    client.on('someEvent', (userId: number) => {
      console.log('Received data from client:', userId);

      // Send a message back to the client
      // client.emit('messageFromServer', 'Hello from the server!');
      this.userSocketMap[userId] = client.id;
      console.log('map of users', this.userSocketMap);
    });
    // const userId = this.getUserIdSomehow(client);
  }

  // @SubscribeMessage('connect')
  // handleSetup(client: Socket, userData: Users): void {
  //   const userId: number = userData.id;

  //   if (!this.connectedUsers.has(userId)) {
  //     this.connectedUsers.set(userId, client);
  //     console.log(`User ${userId} connected`);
  //   }
  //   console.log('alo?')
  //   client.emit('connect', userId);
  // }

  // @SubscribeMessage('message')
  // handleClickMessage(client: Socket, message: Message): void {
  //   console.log('sent message', message);
  //   this.server.emit('sendMessage', message);
  //   // this.server.emit('sortChats')
  // }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any): void {
    const { sender, rec, message } = data;
    // Send the message to the recipient's socket
    console.log('Yooo', sender, rec, message)
    if (message.type === 'Chat') {
      this.server.to(this.userSocketMap[sender]).emit('receiveMessage', message);
      this.server.to(this.userSocketMap[rec]).emit('receiveMessage', message);
    }
    else if (message.type === 'Room')
      this.server.emit('receiveMessage', message);
  }

  @SubscribeMessage('sortContacts')
  handleSortContacts(): void { 
    // const { sender, rec, contact } = data;
    // Send the message to the recipient's socket
    // console.log('Sort', contact , ' for ', sender , ' and ', rec)
    this.server.emit('sortingContacts');
    // this.server.to(this.userSocketMap[rec]).emit('sortChats', contact);
  }

  @SubscribeMessage('roomMessage')
  handleRoomMessage(@MessageBody() data: any): void {
    const { message } = data;
    this.server.emit('receiveMessage', message);
  }

  @SubscribeMessage('roomMembers')
  handleRoomMembers(client: Socket, rec: number): void {
    // console.log('Dkhol a ',user);
    this.server.emit('addMember', rec);
  }

  @SubscribeMessage('removeRoomMembers')
  handleRemoveRoomMembers(client: Socket, user: Users): void {
    console.log('Khrroj 3liya ',user);
    this.server.emit('removeMembers', user);
  }

  @SubscribeMessage('createRoom')
  handleRoomCreation(client: Socket, data: any): void {
    const { room, owner } = data
    console.log(owner, 'WANTS TO CREATE ROOM', room)
    this.server.to(this.userSocketMap[owner]).emit('newRoom', room, owner);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeft(client: Socket, data: any): void {
    const { roomId, owner } = data
    console.log(owner, 'WANTS TO LEAVE ROOM', roomId)
    this.server.to(this.userSocketMap[owner]).emit('leavingRoom', roomId, owner);
  }

  // @SubscribeMessage('sortChats')
  // handleRoomLeft(client: Socket, data: any): void {
  //   const { roomId, owner } = data
  //   console.log(owner, 'WANTS TO LEAVE ROOM', roomId)
  //   this.server.to(this.userSocketMap[owner]).emit('leavingRoom', roomId, owner);
  // }


  handleDisconnect(client: Socket): void {
    const userIdToRemove = [...this.userSocketMap.entries()].find(([_, socketId]) => socketId === client.id)?.[0];

    if (userIdToRemove) {
      this.userSocketMap.delete(userIdToRemove);
      console.log(`User with ID ${userIdToRemove} disconnected`);
      console.log('Updated map of users:', this.userSocketMap);
    }
  }

  // @SubscribeMessage('notification')
  // handleNotification(@MessageBody() data: any): void {
  //   const { notif } = data;
  //   // Send the message to the recipient's socket
  //   console.log('Yooo', notif)
  //   // this.server.to(this.userSocketMap[sender]).emit('sendNotification', message, data.rec);
  //   this.server.to(this.userSocketMap[notif.receiverId]).emit('receiveNotification', notif);
  // }

}
