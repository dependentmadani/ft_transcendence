import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
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

    @Get('owner/:roomId')
    async getRoomOwner(@Param('roomId', ParseIntPipe) roomId: number) {
        return this.roomUsersService.getRoomOwner(roomId)
    }

    @Get('role/:roomId/:userId')
    async getRoomMemberRole(@Param('roomId', ParseIntPipe) roomId: number,
                        @Param('userId', ParseIntPipe) userId: number) {
        return this.roomUsersService.getRoomMemberRole(roomId, userId)
    }

    @Post()
    async createRoomUsers(@Body('roomId', ParseIntPipe) roomId: number,
                         @Body('userId', ParseIntPipe) userId: number, 
                         @Body('role') role: string) {
        return this.roomUsersService.createRoomUsers(roomId, userId, role)
    }

    @Patch('/:roomId/:userId')
    async EditRoomUsers(@Param('roomId', ParseIntPipe) roomId: number,
                         @Param('userId', ParseIntPipe) userId: number, 
                         @Body('role') role: string) {
        return this.roomUsersService.editRoomUsers(roomId, userId, role)
    }

    @Delete()
    async deleteAllRoomUsers() {
        return this.roomUsersService.deleteAllRoomUsers()
    }
    
    @Delete('/:roomId')
    async deleteRoom(@Param('roomId', ParseIntPipe) roomId: number) {
        return this.roomUsersService.deleteOneRoomUser(roomId)
    }

    @Delete('/:roomId/:userId')
    async deleteSpecificRoomUser(@Param('roomId', ParseIntPipe) roomId: number,
                                @Param('userId', ParseIntPipe) userId: number) {
        return this.roomUsersService.deleteSpecificRoomUser(roomId, userId)
    }
}
