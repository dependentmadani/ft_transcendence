import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomUsers } from '@prisma/client'

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
                where: { userId: userId }
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
                        { role: 'OWNER' },
                    ]
                }
            })
        }
        catch (err) {
            console.error(`Couldn't find users in this room: ${err}`)
        }
    }

    async createRoomUsers(roomId: number, userId: number, role: string) {
        try {
            const roomUser = await this.prisma.roomUsers.findMany({
                where: {
                    AND: [
                        { roomId: roomId },
                        { userId: userId },
                    ]
                }
            })
            if (roomUser.length === 0) {
                return await this.prisma.roomUsers.create({
                    data: {
                        roomId: roomId,
                        userId: userId,
                        role: role,
                    }
                })
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
}
