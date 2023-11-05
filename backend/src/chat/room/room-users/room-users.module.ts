import { Module } from '@nestjs/common';
import { InvitationsController } from '../invitations/invitations.controller';
import { InvitationsService } from '../invitations/invitations.service';
import { ChatService } from 'src/chat/chat.service';


@Module({
    controllers: [InvitationsController],
    providers: [InvitationsService]
})
export class RoomUsersModule {}
