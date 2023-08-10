import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
    
    constructor(private prisma: PrismaService) {}

    getMessages(): string[] {
        return ['fir3awn', 's3dia']
    }

    getOneMessage(): string {
        return 'sadi9i! ghayarha'
    }

    // async createMessage(chatId: string, senderId: string, text: string): Promise<string> {
    //     console.log(chatId)
    //     try {
    //         const message = await this.prisma.message.create({
    //             chatId: chatId, senderId: senderId, text: text
    //         })
    //         return chatId
    //     }
    //     catch {
    //         // throw new UnauthorizedException('error')
    //     }
    //     return 'created!'
    // }
}