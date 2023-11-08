import { Module } from '@nestjs/common';
import { InvitationsController } from '../invitations/invitations.controller';
import { InvitationsService } from '../invitations/invitations.service';
import { ChatService } from 'src/chat/chat.service';
import { RoomService } from '../room.service';


@Module({
    controllers: [InvitationsController],
    providers: [InvitationsService, RoomService]
})
export class RoomUsersModule {}
