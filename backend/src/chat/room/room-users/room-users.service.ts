import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomUsers } from '@prisma/client'

@Injectable()
export class RoomUsersService {
    constructor(private prisma: PrismaService) {}
    
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
