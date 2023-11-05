import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { webSocketJwtStrategy } from 'src/strategy';
import { RoomService } from './room/room.service';
import { UsersService } from 'src/users/users.service';
import { RoomUsersService } from './room/room-users/room-users.service';

@Module({
    imports: [PrismaModule, JwtModule.register({})],
    controllers: [ChatController],
    providers: [ChatService, ChatGateway, RoomUsersService, RoomService, UsersService, AuthService, PrismaService],
})
export class ChatModule {}
