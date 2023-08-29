import { Controller, Get } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from '@prisma/client'

@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Get()
    async getRooms(): Promise<Room[]> {
        return this.roomService.getRooms()
    }
}
