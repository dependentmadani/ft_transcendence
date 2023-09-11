import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { InvitationsService } from './room/invitations/invitations.service';

@Module({
    controllers: [ChatController],
    providers: [ChatService, ChatGateway, InvitationsService],
})
export class ChatModule {}
