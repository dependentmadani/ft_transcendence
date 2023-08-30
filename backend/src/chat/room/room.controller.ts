import { Body, Controller, Get, Post } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from '@prisma/client'
import { Public } from "src/decorator";

@Public()
@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Get()
    async getRooms(): Promise<Room[]> {
        return this.roomService.getRooms()
    }

    @Post()
    async createRoom(@Body('roomName') roomName: string,
                        @Body('roomAvatar') roomAvatar: string,
                        @Body('roomUser') roomUser: number,
                        @Body('role') role: string) {
        return this.roomService.createRoom(roomName, roomAvatar, roomUser, role)
    }
}
