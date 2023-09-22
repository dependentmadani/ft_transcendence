import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';
import { NotificationDto } from './dto/create-notification.dto';
import { JwtPayload } from 'src/auth/types';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { WsGuard } from 'src/guards';

export interface socketMetaPayload {
  socketId: string;
}

@WebSocketGateway({namespace: "notification",cors: {
  origin: 'localhost:8000*'
}})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


  socketMap: Map<number, Socket[]> = new Map<number, Socket[] >();
  constructor( private authservice: AuthService,
    private readonly notificationsService: NotificationsService) {
    }

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
      [client]
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
  @SubscribeMessage('sendNotification')
  async create(@ConnectedSocket() client: Socket ,@MessageBody() createNotificationDto: NotificationDto,
        @Req() req: Request) {
      console.log('socketMap:', this.socketMap);
      console.log('type of client id:', typeof(client.id));
      if (!createNotificationDto || !createNotificationDto.title || !createNotificationDto.type) {
        throw new UnauthorizedException('something wrong with body');
      }
      if (!this.socketMap.has(req.user['sub'])) {
        this.socketMap.get(req.user['sub']).push(client);
      }
      for (let i = 0; i < this.socketMap.get(req.user['sub']).length; ++i) {
        this.socketMap.get(req.user['sub'])[i].emit('send notification',{msg: await this.notificationsService.create(createNotificationDto,
                      req.user['sub'], this.socketMap.get(req.user['sub'])[i].id)});
      }
  }

  // @UseGuards(WsGuard)
  // @SubscribeMessage('allNotification')
  // async findAll(@Req() req: Request) {
  //   this.server.emit('notification',{msg: await this.notificationsService.findAll(req.user['sub'])});
  // }

  // @UseGuards(WsGuard)
  // @SubscribeMessage('viewNotification')
  // async viewNotification(@Req() req: Request) {
  //     this.server.emit('notification', {msg: await this.notificationsService.viewNotification(req.user['sub'])});
  // }

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
/*
import {
  InternalServerErrorException,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Notifications, Users } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ namespace: 'notification', cors: { origin: '*' } })
export class NotificationService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  socketById: Map<number, Socket[]>;
  constructor(
      private jwtService: JwtService,
      private prismaServie: PrismaService,
  ) {
      this.socketById = new Map<number, Socket[]>();
  }
  //disconnect client by delete socket from map
  handleDisconnect(client: Socket) {
      this.changeActivityStatusToOffline(client);
  }
  // make user offline and delete socket from map
  async changeActivityStatusToOffline(client: Socket) {
      const userObj: any = this.jwtService.verify(
          client.handshake.headers.authorization.slice(7),
      );
      const user = await this.prismaServie.users.update({
          where: {
              email: userObj.email,
          },
          data: {
              userStatus: 'OFFLINE',
          },
      });
      this.socketById.delete(user.id);
  }
  //get socket from connecting clients
  handleConnection(client: Socket) {
      this.pushClientInMap(client);
  }

  //get the sending message
  @UseGuards(AuthGuard('websocket-jwt'))
  @SubscribeMessage('send_notification')
  async getNotification(@MessageBody() body: any, @Req() req) {
      const notifcation = await this.pushNotificationToDb(body, req);
      this.sendNotification(notifcation, req);
  }
  //send notification to the target
  async sendNotification(notification, req) {
      const notif: any = await this.prismaServie.notifications.findUnique({
          where: {
              id: notification.id,
          },
          include: {
              reicever: true,
          },
      });
      const sender = await this.prismaServie.users.findFirst({
          where: {
              id: notif.senderId,
          },
      });
      if (this.socketById.has(notif.reiceverId)) {
          for (
              let i = 0;
              i < this.socketById.get(notif.reiceverId).length;
              i++
          ) {
              this.socketById
                  .get(notif.reiceverId)
                  [i].emit('receive_notification', notif);
          }
      }
  }
  //push notification to database
  async pushNotificationToDb(notificationBody, req) {
      const sender = await this.prismaServie.users.findUnique({
          where: {
              email: req.user.email,
          },
      });
      const reicever = await this.prismaServie.users.findUnique({
          where: {
              username: notificationBody.username,
          },
      });
      let notification: Notification =
          await this.prismaServie.notifications.create({
              data: {
                  senderId: sender.id,
                  description: notificationBody.description,
                  title: notificationBody.title,
                  reiceverId: reicever.id,
              },
          });

      return notification;
  }
  //push the client socket in map
  async pushClientInMap(client: Socket) {
      try {
          const userObj: any = this.jwtService.verify(
              client.handshake.headers.authorization.slice(7),
          );
          const user: Users = await this.prismaServie.users.findFirst({
              where: {
                  email: userObj.email,
              },
          });
          if (!this.socketById.has(user.id))
              this.socketById.set(user.id, [client]);
          else this.socketById.get(user.id).push(client);
          await this.prismaServie.users.update({
              where: {
                  email: userObj.email,
              },
              data: {
                  userStatus: 'ONLINE',
              },
          });
      } catch (err) {
          throw new UnauthorizedException();
      }
  }
  //accept or reject friend request and send acceptation
  @UseGuards(AuthGuard('websocket-jwt'))
  @SubscribeMessage('answer_notification')
  async answerToNotification(@MessageBody() body: any, @Req() req) {
      if (body.status == 'accept') {
          let notification = await this.acceptNotificaion(body);
          this.deleteNotification(body);
          let acceptation = {
              title: notification.title,
              reicever: notification.reicever,
              status: 'accepted',
          };
          for (
              let i = 0;
              i < this.socketById.get(notification.reicever.id).length;
              i++
          ) {
              this.socketById
                  .get(notification.senderId)
                  [i].emit('receive_notification', acceptation);
          }
      } else if (body.status == 'reject') this.deleteNotification(body);
  }
  // delete notifiation from database
  async deleteNotification(messageBody) {
      let notif = await this.prismaServie.notifications.findFirst({
          where: {
              id: messageBody.id,
          },
      });
      await this.prismaServie.notifications.deleteMany({
          where: {
              senderId: notif.senderId,
              reiceverId: notif.reiceverId,
              title: notif.title,
          },
      });
  }
  //accept notification
  async acceptNotificaion(messageBody) {
      let notification = await this.prismaServie.notifications.findUnique({
          where: {
              id: messageBody.id,
          },
          include: {
              reicever: true,
          },
      });
      await this.prismaServie.users.update({
          where: {
              id: notification.senderId,
          },
          data: {
              friends: {
                  connect: {
                      id: notification.reicever.id,
                  },
              },
          },
      });
      await this.prismaServie.users.update({
          where: {
              id: notification.reicever.id,
          },
          data: {
              friends: {
                  connect: {
                      id: notification.senderId,
                  },
              },
          },
      });
      return notification;
  }
}
*/
