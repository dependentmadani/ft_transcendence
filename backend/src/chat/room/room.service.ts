import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Room, Users } from '@prisma/client'

@Injectable()
export class RoomService {
    constructor(private prisma: PrismaService) {}

    async getRooms(): Promise<Room[]> {
        try {
            return this.prisma.room.findMany()
        }
        catch (err) {
            throw new UnauthorizedException(`Couldn't find any rooms: `, err)
        }
    }

    async getRoomAdmin(roomId: number): Promise<Users[]> {
        try {
            return this.prisma.room.findMany({
                where: { id: roomId },
                select: {
                    roomUsers: {
                        select: {
                            user: { where: { role: 'ADMIN' } }
                        }
                    }
                }
            })
        }
        catch (err) {
            console.error(`Couldn't find any admins for room ${roomId}`)
        }
    }

    async createRoom(roomName: string, roomAvatar: string, roomUser: number, role: string) {
        return await this.prisma.room.create({
            data: {
                roomName: roomName,
                roomAvatar: roomAvatar,
                roomMembers: [roomUser],
                role: role//'ADMIN',
            }
        })
    }

    async deleteAllRooms() {
        if (await this.prisma.room.deleteMany())
            return `All rooms deleted successufully!`
        else
            return `Couldn't delete rooms!`
    }

    async deleteOneRoom(roomId: number) {
        const room = await this.prisma.room.findUnique({
            where: {
                id: roomId
            }
        })
        if (room) {
            return await this.prisma.room.delete({
                where: {
                    id: roomId
                }
            })
        }
        else
            return `Couldn't find room with id ${roomId}`
    }
}
