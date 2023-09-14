import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RoomUsersService } from './room-users.service';
import { Public } from "src/decorator";

@Public()
@Controller('roomUsers')
export class RoomUsersController {
    constructor(private roomUsersService: RoomUsersService) {}

    @Post()
    async createRoomUsers(@Body('roomId', ParseIntPipe) roomId: number, @Body('userId', ParseIntPipe) userId: number) {
        console.log('HOOOOLA')
        return this.roomUsersService.createRoomUsers(roomId, userId)
    }
}
