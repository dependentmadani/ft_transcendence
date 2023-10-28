import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { webSocketJwtStrategy } from 'src/strategy';
import { NotificationController } from './notifications.controller';

@Module({
  imports: [PrismaModule, AuthModule,PassportModule, JwtModule.register({})],
  controllers: [NotificationController],
  providers: [NotificationsGateway, NotificationsService, PrismaService, AuthService, webSocketJwtStrategy]
})
export class NotificationsModule {}
