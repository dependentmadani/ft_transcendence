import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { NotificationDto } from './dto/create-notification.dto';
import { JwtPayload } from 'src/auth/types';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/guards';

export interface socketMetaPayload extends JwtPayload {
  socketId: string;
}

@WebSocketGateway({cors: {
  origin: 'localhost:8000*'
}})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  socketMap: Map<number, socketMetaPayload> = new Map<number, socketMetaPayload>;

  constructor( private authservice: AuthService,
    private readonly notificationsService: NotificationsService) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      client.disconnect(true);
      return ;
    }

    const payload = await this.authservice.verifyToken(token);
    if (!payload) {
      client.disconnect(true);
      return ;
    }
    console.log('payload:', payload);
    this.socketMap.set(
      payload['sub'],
      {
        sub: payload['sub'],
        email: payload['email'],
        socketId: client.id}
    );
  }

  handleDisconnect(client: Socket) {
    const token = client.handshake.headers.authorization?.split(' ')[1];
    const payload = this.authservice.verifyToken(token);
    this.socketMap.delete(payload['id']);
  }

  // async emitNotification(userId: number, notification: Partial<Notifications>) {
    
  // }

  @UseGuards(WsGuard)
  @SubscribeMessage('createNotification')
  async create(@ConnectedSocket() client: Socket ,@MessageBody() createNotificationDto: NotificationDto,
        @Req() req: Request) {
      console.log('socketMap:', this.socketMap);
      console.log('type of client id:', typeof(client.id))
      if (!createNotificationDto || !createNotificationDto.title || !createNotificationDto.type) {
        throw new UnauthorizedException('something wrong with body');
      }
      this.server.emit('notification',{msg: await this.notificationsService.create(createNotificationDto,
                      req.user['sub'], client.id)});
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('allNotification')
  async findAll(@Req() req: Request) {
    this.server.emit('notification',{msg: await this.notificationsService.findAll(req.user['sub'])});
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('viewNotification')
  async viewNotification(@Req() req: Request) {
      this.server.emit('notification', {msg: await this.notificationsService.viewNotification(req.user['sub'])});
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('acceptNotification')
  async acceptFriend(@MessageBody('friendUsername') friendUsername: string, @Req() req: Request) {
    this.server.emit('notification',{msg: await this.notificationsService.acceptFriend(friendUsername, req.user['sub'])});
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('refuseNotification')
  async refuseFriend(@MessageBody('friendUsername') friendUsername: string, @Req() req: Request) {
    this.server.emit('notification',{msg: await this.notificationsService.refureFriend(friendUsername, req.user['sub'])});
  }
}
