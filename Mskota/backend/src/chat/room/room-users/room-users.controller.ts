import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RoomUsersService } from './room-users.service';
import { Public } from "src/decorator";

@Controller('roomUsers')
export class RoomUsersController {
    constructor(private roomUsersService: RoomUsersService) {}

    @Get()
    async getAllRoomUsers() {
        return this.roomUsersService.getAllRoomUsers()
    }

    @Get('room/:roomId')
    async getRoomUsers(@Param('roomId', ParseIntPipe) roomId: number) {
        return this.roomUsersService.getRoomUsers(roomId)
    }

    @Get('user/:userId')
    async getUserRooms(@Param('userId', ParseIntPipe) userId: number) {
        return this.roomUsersService.getUserRooms(userId)
    }

    @Get('admins/:roomId')
    async getRoomAdmins(@Param('roomId', ParseIntPipe) roomId: number) {
        return this.roomUsersService.getRoomAdmins(roomId)
    }

    @Post()
    async createRoomUsers(@Body('roomId', ParseIntPipe) roomId: number,
                         @Body('userId', ParseIntPipe) userId: number, 
                         @Body('role') role: string) {
        return this.roomUsersService.createRoomUsers(roomId, userId, role)
    }

    @Delete()
    async deleteAllRoomUsers() {
        return this.roomUsersService.deleteAllRoomUsers()
    }
    
    @Delete('/:roomId')
    async deleteRoom(@Param('roomId', ParseIntPipe) roomId: number) {
        return this.roomUsersService.deleteOneRoomUser(roomId)
    }
}