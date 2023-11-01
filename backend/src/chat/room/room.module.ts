import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { MulterModule } from '@nestjs/platform-express';
// import { InvitationsController } from './invitations/invitations.controller';
import { InvitationsModule } from './invitations/invitations.module';
import { RoomUsersController } from './room-users/room-users.controller';
import { RoomUsersService } from './room-users/room-users.service';
import { RoomUsersModule } from './room-users/room-users.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatService } from '../chat.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ MulterModule.register({ dest: './uploads' }), InvitationsModule, RoomUsersModule, PrismaModule, JwtModule.register({}), AuthModule ],
  controllers: [RoomController, RoomUsersController],
  providers: [RoomService, ChatGateway, RoomUsersService, ChatService, RoomService, UsersService, AuthService],
})
export class RoomModule {}
