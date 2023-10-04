import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { IfNotAuthenticatedMiddleware } from './middleware/if-not-authenticate.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './guards';
import { HomeController } from './home/home.controller';
import { HomeModule } from './home/home.module';
import { MessageModule } from './chat/message/message.module';
import { RoomModule } from './chat/room/room.module';
import { InvitationsModule } from './chat/room/invitations/invitations.module';
import { RoomUsersModule } from './chat/room/room-users/room-users.module';
import { NotificationsModule } from './notifications/notifications.module';

import { ClassicSocketGateway } from './websocket/Classicsocket.gateway';
import { MatchSocketGateway } from './websocket/MatchSocket.gateway';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }) ,
    PassportModule,
    HomeModule,
    AuthModule ,
    UsersModule,
    ChatModule,
    MessageModule,
    RoomModule,
    InvitationsModule,
    RoomUsersModule,
    PrismaModule,
    NotificationsModule,
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: AtGuard,
   
  }, ClassicSocketGateway,
    MatchSocketGateway],
  controllers: [HomeController]
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IfNotAuthenticatedMiddleware)
      .exclude({path:'/auth*', method: RequestMethod.ALL})
      .forRoutes({ path: '/u*', method: RequestMethod.ALL }); // Apply the middleware to all routes under /users
  }
}
