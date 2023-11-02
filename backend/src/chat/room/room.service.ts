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

    async getOneRoom(roomId: number): Promise<Room> {
        try {
            return await this.prisma.room.findUnique({
                where: { id: roomId }
            })
        }
        catch (err) {
            console.error(`Couldn't find any room with id: ${roomId} ${err}`)
        }
    }

    async getRoomAvatar(id: number): Promise<string> {
        try {
            const room = await this.prisma.room.findUnique({
                where: { id: id }
            })
            return room.roomAvatar
        }
        catch (err) {
            console.error(`Couldn't find any room with id: ${id} ${err}`)
        }
    }

    async createRoom(roomName: string, roomAvatar: string, roomType: string) {
        return await this.prisma.room.create({
            data: {
                roomName: roomName,
                roomAvatar: roomAvatar,
                roomType: roomType,
                // roomMembers: [roomUser],
                // role: role//'ADMIN',
            }
        })
    }

    async updateRoom(roomId: number, roomName: string, roomAvatar: string, roomType: string) {
        try {
            return await this.prisma.room.update({
                where: {
                    id: roomId,
                },
                data: { 
                    roomName: roomName,
                    roomAvatar: roomAvatar,
                    roomType: roomType,
                }
            });
        }
        catch {
            console.error(`Couldn't create room with id ${roomId}`)
        }
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
