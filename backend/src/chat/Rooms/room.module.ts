import { Module } from "@nestjs/common";
import { roomController } from "./room.controller";
import { roomService } from "./room.service";

@Module({
    controllers: [roomController],
    providers: [roomService]
})
export class roomModule {}