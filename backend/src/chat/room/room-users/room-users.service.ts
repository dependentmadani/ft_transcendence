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

    async createRoomUsers(roomId: number, userId: number) {
        try {
            return this.prisma.roomUsers.create({
                data: {
                    roomId: roomId,
                    userId: userId,
                    role: 'OWNER'
                }
            })
        }
        catch (err) {
            console.error(`Couldn't create room users table: ${err}`)
        }
    }
}
