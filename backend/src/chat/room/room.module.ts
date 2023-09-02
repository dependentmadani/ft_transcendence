import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [ MulterModule.register({ dest: './uploads' }) ],
  controllers: [RoomController],
  providers: [RoomService, ChatGateway],
})
export class RoomModule {}
