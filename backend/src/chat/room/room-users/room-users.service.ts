import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomUsers } from '@prisma/client'
import { allow } from 'joi';

@Injectable()
export class RoomUsersService {
    constructor(private prisma: PrismaService) {}
    
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

    async getRoomMemberRole(roomId: number, userId: number) {
        try {
            const roomUser = await this.prisma.roomUsers.findMany({
                where: {
                    AND: [
                        { roomId: roomId },
                        { userId: userId },
                    ]
                }
            })
            return roomUser
        }
        catch (err) {
            console.error(`Couldn't find users in this room: ${err}`)
        }
    }

    async createRoomUsers(roomId: number, userId: number, role: string, allowed: boolean) {
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
                console.log('yoooo')
                return await this.prisma.roomUsers.create({
                    data: {
                        roomId: roomId,
                        userId: userId,
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
            console.log('YOOOOOOOO')
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
            console.log('YOOOOOOOO')
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
        console.log('HAIYA', roomUsers, roomId, userId)
        if (roomUsers) {
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
