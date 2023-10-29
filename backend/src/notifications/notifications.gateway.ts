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

@WebSocketGateway({namespace: "notification",cors: {
  origin: '*'
}})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  socketMap: Map<number, Socket[]>;

  constructor( private prismaService: PrismaService, 
    private jwtService: JwtService,
    private authService: AuthService,
    private readonly notificationsService: NotificationsService) {
      this.socketMap = new Map<number, Socket[] >();
    }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect(true);
        return ;
      }
      
      const payload = await this.authService.verifyToken(token);
      if (!payload) {
        client.disconnect(true);
        return ;
      }
      const user = await this.prismaService.users.findFirst({
        where: {
          id: payload['sub'],
        },
      });
      if (!this.socketMap.has(user.id)) {
        this.socketMap.set(user.id, [client]);
      }
      else {
        this.socketMap.get(user.id).push(client);
      }
      await this.prismaService.users.update({
        where: {
          id: user.id,
        },
        data: {
          userStatus: "ONLINE",
        },
      });
      console.log('all passed successfully')
    }
    catch ( e ) {
      console.log(e);
      console.log('Something wrong in handling connection!');
    }
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];
    const payload = await this.jwtService.verify(token);
    const user = await this.prismaService.users.update({
      where: {
        id: payload.id,
      },
      data: {
        userStatus: 'OFFLINE',
      }
    })
    this.socketMap.delete(payload.id);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('sendNotification')
  async create(@ConnectedSocket() client: Socket ,@MessageBody() createNotificationDto: NotificationDto,
        @Req() req: Request) {
          
      if (!createNotificationDto || !createNotificationDto.title || !createNotificationDto.type) {
        throw new UnauthorizedException('something wrong with body');
      }
      console.log('socketMap');
      const notif = await this.notificationsService.create(createNotificationDto, req.user['sub'], client.id);
      const len = this.socketMap.get(notif.receiverId) == undefined ? 0 : this.socketMap.get(notif.receiverId).length;
      for (let i = 0; i < len; ++i) {
        this.socketMap.get(notif.receiverId)[i].emit('receiveNotification',notif);
      }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('acceptNotification')
  async acceptFriend(@MessageBody('friendUsername') notifBody: NotificationBody, @Req() req: Request) {
    let notif = await this.notificationsService.acceptFriend(notifBody, req.user['sub']);
    
    const len = this.socketMap.get(notif.receiverId) == undefined ? 0 : this.socketMap.get(notif.receiverId).length;
    for (let i = 0; i < len; ++i) {
      this.socketMap.get(notif.senderId)[i].emit('acceptedNotification', {
        receiver: notif.receiverUser.username,
        title: notif.title,
        status: 'accepted',
      });
    }
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('refuseNotification')
  async refuseFriend(@MessageBody('friendUsername') notifBody: NotificationBody, @Req() req: Request) {
    let notif = await this.notificationsService.refureFriend(notifBody, req.user['sub']);
  }
}
