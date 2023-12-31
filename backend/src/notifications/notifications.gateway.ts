import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { NotificationDto, NotificationBody } from './dto/create-notification.dto';
import { JwtPayload } from 'src/auth/types';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/guards';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

export interface socketMetaPayload {
  socketId: string;
}

// @WebSocketGateway({namespace: "notification",cors: {
//   origin: 'localhost:8000*'
// }})


@WebSocketGateway({ namespace: 'notification', cors: { origin: "*" } })
export class NotificationsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  socketMap: Map<number, Socket[]>;

  private userSocketMap = new Map<number, string>();

  constructor( private prismaService: PrismaService, 
    // private jwtService: JwtService,
    private readonly notificationsService: NotificationsService) {
      // this.socketMap = new Map<number, Socket[] >();
    }

  // async handleConnection(client: Socket) {
  //   try {
  //     const token = client.handshake.headers.authorization?.split(' ')[1];
  //     if (!token) {
  //       client.disconnect(true);
  //       return ;
  //     }

  //     const payload = await this.jwtService.verify(token);
  //     if (!payload) {
  //       client.disconnect(true);
  //       return ;
  //     }
  //     const user = await this.prismaService.users.findFirst({
  //       where: {
  //         id: payload.id,
  //       },
  //     });
  //     if (!this.socketMap.has(user.id)) {
  //       this.socketMap.set(user.id, [client]);
  //     }
  //     else {
  //       this.socketMap.get(user.id).push(client);
  //     }
  //     await this.prismaService.users.update({
  //       where: {
  //         id: user.id,
  //       },
  //       data: {
  //         userStatus: "ONLINE",
  //       },
  //     });
  //   }
  //   catch ( e ) {
  //     throw new UnauthorizedException('Something wrong in handling connection!');
  //   }
  // }

  // async handleDisconnect(client: Socket) {
  //   const token = client.handshake.headers.authorization?.split(' ')[1];
  //   const payload = await this.jwtService.verify(token);
  //   const user = await this.prismaService.users.update({
  //     where: {
  //       id: payload.id,
  //     },
  //     data: {
  //       userStatus: 'OFFLINE',
  //     }
  //   })
  //   this.socketMap.delete(payload.id);
  // }

  // async emitNotification(userId: number, notification: Partial<Notifications>) {
    
  // }

  // @UseGuards(WsGuard)
  // @SubscribeMessage('sendNotification')
  // async create(@ConnectedSocket() client: Socket ,@MessageBody() createNotificationDto: NotificationDto,
  //       @Req() req: Request) {
  //     // console.log('socketMap:', this.socketMap);
  //     // console.log('type of client id:', typeof(client.id));
  //     if (!createNotificationDto || !createNotificationDto.title || !createNotificationDto.type) {
  //       throw new UnauthorizedException('something wrong with body');
  //     }
  //     const notif = await this.notificationsService.create(createNotificationDto, req.user['sub'], client.id);
  //     for (let i = 0; i < this.socketMap.get(req.user['sub']).length; ++i) {
  //       this.socketMap.get(notif.receiverId)[i].emit('receiveNotification',notif);
  //     }
  // }

  // @UseGuards(WsGuard)
  // @SubscribeMessage('acceptNotification')
  // async acceptFriend(@MessageBody('friendUsername') notifBody: NotificationBody, @Req() req: Request) {
  //   let notif = await this.notificationsService.acceptFriend(notifBody, req.user['sub']);
    
  //   for (let i = 0; i < this.socketMap.get(notif.receiverId).length; ++i) {
  //     this.socketMap.get(notif.senderId)[i].emit('acceptedNotification', {
  //       receiver: notif.receiverUser.username,
  //       // title: notif.title,
  //       status: 'accepted',
  //     });
  //   }
  // }

  // @UseGuards(WsGuard)
  // @SubscribeMessage('refuseNotification')
  // async refuseFriend(@MessageBody('friendUsername') notifBody: NotificationBody, @Req() req: Request) {
  //   let notif = await this.notificationsService.refureFriend(notifBody, req.user['sub']);
  // }

  ////////////////////////////////////
  handleConnection(client: Socket): void {

    client.on('someEvent', (userId: number) => {
      // console.log('Received data from client:', userId);

      // Send a message back to the client
      // client.emit('messageFromServer', 'Hello from the server!');
      this.userSocketMap[userId] = client.id;
      // console.log('notification map of users', this.userSocketMap);
    });
    // const userId = this.getUserIdSomehow(client);
  }

  @SubscribeMessage('notification')
  handleNotification(@MessageBody() data: any): void {
    const { notif } = data;
    // Send the message to the recipient's socket
    // console.log('Yooooooooo', notif.receiverUser.id)
    // this.server.to(this.userSocketMap[sender]).emit('sendNotification', message, data.rec);
    this.server.to(this.userSocketMap[notif.receiverUser.id]).emit('receiveNotification', notif);
  }

  // @SubscribeMessage('removeNotification')
  // handleRemoveNotification(@MessageBody() rec: any): void {
  //   // const { rec } = data;
  //   // Send the message to the recipient's socket
  //   console.log('Yooooooooo', rec)
  //   // this.server.to(this.userSocketMap[sender]).emit('sendNotification', message, data.rec);
  //   this.server.to(this.userSocketMap[rec.receiverUser.id]).emit('removingNotification');
  // }

  @SubscribeMessage('acceptNotification')
  handleAcceptedNotification(@MessageBody() data: any): void {
    const { notif } = data;
    // Send the message to the recipient's socket
    // console.log('Pooooooooo', notif)
    // this.server.to(this.userSocketMap[sender]).emit('sendNotification', message, data.rec);
    this.server.to(this.userSocketMap[notif.sender.id]).emit('notificationAccepted', notif);
    // this.server.to(this.userSocketMap[notif.receiver.id]).emit('notificationAccepted', notif);
  }

  @SubscribeMessage('lockChat')
  handleLockChat(@MessageBody() rec: any): void { 
    // const { sender, rec, contact } = data;
    // Send the message to the recipient's socket
    // console.log('Sort', contact , ' for ', sender , ' and ', rec)
    // console.log('chhhhhhhhhhhh', rec)
    this.server.to(this.userSocketMap[rec]).emit('lockingChat', rec);
    // this.server.to(this.userSocketMap[rec]).emit('sortChats', contact);
  }

}
