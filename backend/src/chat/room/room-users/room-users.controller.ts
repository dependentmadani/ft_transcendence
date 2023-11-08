import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req } from '@nestjs/common';
import { RoomUsersService } from './room-users.service';
import { Public } from "src/decorator";
import { ChatService } from 'src/chat/chat.service';
import { Chat, Room, RoomUsers, Users } from '@prisma/client';
import { RoomService } from '../room.service';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

@Controller('roomUsers')
export class RoomUsersController {
    constructor(private roomUsersService: RoomUsersService, private chatService: ChatService, private roomService: RoomService, private userService: UsersService) {}

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
        return await this.roomUsersService.getUserRooms(userId)
    }

    @Get('one-contact/:userId/:recId')
    async getOneContacts(@Req() req: Request, @Param('userId', ParseIntPipe) userId: number, @Param('recId', ParseIntPipe) recId: number) {
        
        const me = req.user['sub']
        return await this.roomUsersService.getOneContact(me, userId, recId)
    }

    @Get('all-contacts')
    async getAllContacts(@Req() req: Request) {

        const me = req.user['sub']
        const chats: Chat[] = await this.chatService.getUserChats(me)
        const rooms: RoomUsers[] = await this.roomUsersService.getUserRooms(me)

        const chatPromises = chats.map(async chat => {
            const user = req.user['sub']
            const receiver = chat.chatUsers[0] === user ? chat.chatUsers[1] : chat.chatUsers[0];
            const _receiver: Users = await this.userService.findUserById(receiver);

            // Check if receiver is not blocked
            if (this.userService.checkBlockedFriend(me, receiver))
                return { id: chat.chatId, name: _receiver.username, avatar: _receiver.avatar, latestMessageContent: chat.latestMessageContent, latestMessageDate: chat.latestMessageDate, type: 'Chat' };
            return null
        });
        
        const roomPromises = rooms.map(async room => {
            const _room: Room = await this.roomService.getOneRoom(room.roomId);

            // Check if user is not banned or muted
            // console.log('room info', _room);
            if (room.role !== 'BANNED' && room.role !== 'MUTED')
                return { id: room.roomId, name: _room.roomName, avatar: `http://localhost:8000/room/roomAvatar/${_room.id}`, latestMessageContent: _room.latestMessageContent, latestMessageDate: _room.latestMessageDate, type: 'Room', protection: _room.roomType };
            return null
        });
        
        const chatResults = await Promise.all(chatPromises);
        const roomResults = await Promise.all(roomPromises);
        
        const t = [...chatResults, ...roomResults];
        const contacts: any = t.filter((contact) => contact !== null);
        const sortedContacts = contacts.sort((a, b) => {
            const dateA = new Date(a.latestMessageDate).getTime();
            const dateB = new Date(b.latestMessageDate).getTime();
            return dateB - dateA;
        });

        // console.log('Contacts', contacts);
        // const filteredContacts: any = sortedContacts.filter((contact) => contact !== null);
    //     setChats(filteredChatsData)
        return sortedContacts
    }

    @Get('all-rooms')
    async getAllRooms(@Req() req: Request) {

        const me = req.user['sub']
        const rooms: Room[] = await this.roomService.getRooms()
        
        const roomPromises = rooms.map(async room => {

            // Check if user is not banned or muted
            const _role = await this.roomUsersService.getRoomMemberRole(room.id, me)
            // console.log('Hado roles', _role)
            if (_role !== 'BANNED' && _role !== 'MUTED' && room.roomType !== 'Private')
                return { id: room.id, name: room.roomName, avatar: `http://localhost:8000/room/roomAvatar/${room.id}`, latestMessageContent: room.latestMessageContent, latestMessageDate: room.latestMessageDate, type: 'Room', protection: room.roomType };
            return null
        }); 
        
        const roomResults = await Promise.all(roomPromises);
        
        const contacts: any = roomResults.filter((contact) => contact !== null);
        const sortedContacts = contacts.sort((a, b) => {
            const dateA = new Date(a.latestMessageDate).getTime();
            const dateB = new Date(b.latestMessageDate).getTime();
            return dateB - dateA;
        });

        return sortedContacts
    }

    @Get('admins/:roomId')
    async getRoomAdmins(@Param('roomId', ParseIntPipe) roomId: number) {
        return this.roomUsersService.getRoomAdmins(roomId)
    }

    @Get('is-admin/:roomId/:userId')
    async isRoomAdmins(@Param('roomId', ParseIntPipe) roomId: number,
                            @Param('userId', ParseIntPipe) userId: number) {
        return this.roomUsersService.isRoomAdmins(roomId, userId)
    }

    @Get('owner/:roomId')
    async getRoomOwner(@Param('roomId', ParseIntPipe) roomId: number) {
        return this.roomUsersService.getRoomOwner(roomId)
    }

    @Get('role/:roomId/:userId')
    async getRoomMemberRole(@Param('roomId', ParseIntPipe) roomId: number,
                        @Param('userId', ParseIntPipe) userId: number): Promise<string> {
        return await this.roomUsersService.getRoomMemberRole(roomId, userId)
    }

    @Get('is-allowed/:roomId/:userId')
    async isRoomMemberAllowed(@Param('roomId', ParseIntPipe) roomId: number,
                        @Param('userId', ParseIntPipe) userId: number): Promise<boolean> {
        return await this.roomUsersService.isRoomMemberAllowed(roomId, userId)
    }

    @Put('allow/:roomId/:userId')
    async allowMember(@Param('roomId', ParseIntPipe) roomId: number,
                        @Param('userId', ParseIntPipe) userId: number,
                        @Body('allowed') allowed: boolean) {
        return this.roomUsersService.allowMember(roomId, userId, allowed)
    }

    @Post()
    async createRoomUsers(@Body('roomId', ParseIntPipe) roomId: number,
                         @Body('userId', ParseIntPipe) userId: number,
                         @Body('userUsername') userUsername: string,
                         @Body('role') role: string,
                         @Body('allowed') allowed: boolean) {
        return this.roomUsersService.createRoomUsers(roomId, userId, userUsername, role, allowed)
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
