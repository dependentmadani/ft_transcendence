import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Module({
  controllers: [RoomController],
  providers: [RoomService, ChatGateway]
})
export class RoomModule {}
