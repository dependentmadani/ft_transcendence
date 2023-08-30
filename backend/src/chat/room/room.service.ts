import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Room } from '@prisma/client'

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

    async createRoom(roomName: string, roomAvatar: string, roomUser: number, role: string) {
        await this.prisma.room.create({
            data: {
                roomName: roomName,
                roomAvatar: roomAvatar,
                roomUsers: [roomUser],
                role: role//'ADMIN',
            }
        })
    }
}
