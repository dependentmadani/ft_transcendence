import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Room, Users } from '@prisma/client'
import * as bcrypt from 'bcrypt';

@Injectable()
export class RoomService {
    constructor(private prisma: PrismaService) {}

    async hashData(pass: string) {
        return await bcrypt.hash(pass, 10);
    }

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

    async createRoom(roomName: string, roomAvatar: string, roomType: string, roomPass: string) {
        return await this.prisma.room.create({
            data: {
                roomName: roomName,
                roomAvatar: roomAvatar,
                roomType: roomType,
                roomPass: await this.hashData(roomPass),
                // roomMembers: [roomUser],
                // role: role//'ADMIN',
            }
        })
    }

    async checkRoomAccess(roomId: number, roomPass: string): Promise<boolean> {
        const room = await this.prisma.room.findUnique({
            where: { id: roomId }
        })
        if (room) {
            console.log('Pass ', roomPass, room.roomPass)
            const passCheck = await bcrypt.compare(roomPass, room.roomPass)
            if (passCheck)
                return true
        }
        return false
    }

    async updateRoom(roomId: number, roomName: string, roomAvatar: string, roomType: string, roomPass: string) {
        try {
            return await this.prisma.room.update({
                where: {
                    id: roomId,
                },
                data: { 
                    roomName: roomName,
                    roomAvatar: roomAvatar,
                    roomType: roomType,
                    roomPass: await this.hashData(roomPass),
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
