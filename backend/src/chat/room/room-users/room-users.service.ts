import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chat, RoomUsers, Users } from '@prisma/client'
import { allow } from 'joi';
import { ChatService } from 'src/chat/chat.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoomUsersService {
    constructor(private prisma: PrismaService, private chatService: ChatService, private userService: UsersService) {}
    
    async getAllRoomUsers() {
        try {
            return this.prisma.roomUsers.findMany()
        }
        catch (err) {
            console.error(`Couldn't find users in this room: ${err}`)
        }
    }

    async getRoomUsers(roomId: number) {
        try {
            return this.prisma.roomUsers.findMany({
                where: { roomId: roomId }
            })
        }
        catch (err) {
            console.error(`Couldn't find users in this room: ${err}`)
        }
    }

    async getUserRooms(userId: number) {
        try {
            return this.prisma.roomUsers.findMany({
                where: {
                    AND: [
                        { userId: userId },
                        { NOT: [
                            {role: 'BANNED' },
                            {role: 'MUTED' },
                        ]}
                    ],
                }
            })
        }
        catch (err) {
            console.error(`Couldn't find users in this room: ${err}`)
        }
    }

    async getRoomAdmins(roomId: number) {
        try {
            return this.prisma.roomUsers.findMany({
                where: {
                    AND: [
                        { roomId: roomId },
                        { role: 'ADMIN' },
                    ]
                }
            })
        }
        catch (err) {
            console.error(`Couldn't find users in this room: ${err}`)
        }
    }

    async isRoomAdmins(roomId: number, userId: number): Promise<Boolean> {
        try {
            const admin = await this.prisma.roomUsers.findMany({
                where: {
                    AND: [
                        { roomId: roomId },
                        { userId: userId },
                        { OR: [
                            { role: 'ADMIN' },
                            { role: 'OWNER' },
                        ] }
                    ]
                }
            })

            console.log(admin)
            if (admin.length !== 0)
                return true
            return false
        }
        catch (err) {
            console.error(`Couldn't find users in this room: ${err}`)
            return false
        }
    }

    async getRoomOwner(roomId: number) {
        try {
            return this.prisma.roomUsers.findMany({
                where: {
                    AND: [
                        { roomId: roomId },
                        { role: 'OWNER' },
                    ]
                }
            })
        }
        catch (err) {
            console.error(`Couldn't find users in this room: ${err}`)
        }
    }

    async getRoomMemberRole(roomId: number, userId: number): Promise<string> {
        try {
            const roomUser = await this.prisma.roomUsers.findMany({
                where: {
                    AND: [
                        { roomId: roomId },
                        { userId: userId },
                    ]
                }
            })
            if (roomUser[0].role)
                return roomUser[0].role
            return '';
        }
        catch (err) {
            console.error(`Couldn't find users in this room: ${err}`)
            return '';
        }
    }

    async isRoomMemberAllowed(roomId: number, userId: number): Promise<boolean> {
        try {
            const roomUser = await this.prisma.roomUsers.findMany({
                where: {
                    AND: [
                        { roomId: roomId },
                        { userId: userId },
                    ]
                }
            })
            console.log('roomuser', roomUser)
            if (roomUser.length !== 1)
                return false
            return roomUser[0].allowed
        }
        catch (err) {
            console.error(`Couldn't find users in this room: ${err}`)
            return false
        }
    }


    async getOneContact(me: number, userId: number, recId: number) {

        const chat: Chat = await this.chatService.getCommunChat(userId, recId)

        if (chat) {
            const receiver = chat.chatUsers[0] === me ? chat.chatUsers[1] : chat.chatUsers[0];
            const _receiver: Users = await this.userService.findUserById(receiver);
            const contact =  { id: chat.chatId, name: _receiver.username, avatar: _receiver.avatar, latestMessageContent: chat.latestMessageContent, latestMessageDate: chat.latestMessageDate, type: 'Chat' };
            
            return contact
        }
    }

    async createRoomUsers(roomId: number, userId: number, userUsername: string, role: string, allowed: boolean) {
        // console.log('Too')
        try {
            const roomUser = await this.prisma.roomUsers.findMany({
                where: {
                    AND: [
                        { roomId: roomId },
                        { userId: userId },
                    ]
                }
            })
            // It works but at what cost
            if (roomUser.length === 0) {
                // console.log('yoooo')
                return await this.prisma.roomUsers.create({
                    data: {
                        roomId: roomId,
                        userId: userId,
                        userUsername: userUsername,
                        role: role,
                        allowed: allowed,
                    }
                })
            }
        }
        catch (err) {
            console.error(`Couldn't create room users table: ${err}`)
        }
    }

    async editRoomUsers(roomId: number, userId: number, role: string) {
        try {
            const roomUser = await this.prisma.roomUsers.findMany({
                where: {
                    AND: [
                        { roomId: roomId },
                        { userId: userId },
                    ]
                }
            })
            // It works but at what cost
            // console.log('YOOOOOOOO')
            if (roomUser.length === 1) {
                return await this.prisma.roomUsers.update({
                    where: {
                        id: roomUser[0].id,
                    },
                    data: { 
                        role: role,
                    }
                });
            }
        }
        catch (err) {
            console.error(`Couldn't create room users table: ${err}`)
        }
    }

    async allowMember(roomId: number, userId: number, allowed: boolean) {
        try {
            const roomUser = await this.prisma.roomUsers.findMany({
                where: {
                    AND: [
                        { roomId: roomId },
                        { userId: userId },
                    ]
                }
            })
            // It works but at what cost
            // console.log('YOOOOOOOO')
            if (roomUser.length === 1) {
                return await this.prisma.roomUsers.update({
                    where: {
                        id: roomUser[0].id,
                    },
                    data: { 
                        allowed: allowed,
                    }
                });
            }
        }
        catch (err) {
            console.error(`Couldn't create room users table: ${err}`)
        }
    }

    async deleteAllRoomUsers() {
        if (await this.prisma.roomUsers.deleteMany())
            return `All room users deleted successufully!`
        else
            return `Couldn't delete room users!`
    }

    async deleteOneRoomUser(roomId: number) {
        const roomUsers = await this.prisma.roomUsers.findMany({
            where: {
                roomId: roomId
            }
        })
        if (roomUsers) {
            return await this.prisma.roomUsers.deleteMany({
                where: {
                    roomId: roomId
                }
            })
        }
        else
            return `Couldn't find room users with id ${roomId}`
    }

    async deleteSpecificRoomUser(roomId: number, userId: number) {
        const roomUsers = await this.prisma.roomUsers.findMany({
            where: {
                AND :[
                    { roomId: roomId },
                    { userId: userId },
                ]
            }
        })
        // It works but at what cost
        // console.log('HAIYA', roomUsers, roomId, userId)
        if (roomUsers.length === 1) {
            return await this.prisma.roomUsers.deleteMany({
                where: {
                    id: roomUsers[0].id
                }
            })
        }
        else
            return `Couldn't find room users with id ${roomId}`
    }
}
