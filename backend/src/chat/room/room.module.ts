import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { MulterModule } from '@nestjs/platform-express';
// import { InvitationsController } from './invitations/invitations.controller';
import { InvitationsModule } from './invitations/invitations.module';

@Module({
  imports: [ MulterModule.register({ dest: './uploads' }), InvitationsModule ],
  controllers: [RoomController],
  providers: [RoomService, ChatGateway],
})
export class RoomModule {}
