import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
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
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    HomeModule,
    AuthModule,
    UsersModule,
    ChatModule,
    PrismaModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
  controllers: [HomeController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IfNotAuthenticatedMiddleware)
      .forRoutes({
        path: '/users*',
        method: RequestMethod.ALL,
      }); // Apply the middleware to all routes under /users
  }
}
