import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Message } from "@prisma/client";
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
    
    constructor(private prisma: PrismaService) {}

    async getMessages(): Promise<Message[]> {
        try {
            return this.prisma.message.findMany()
        }
        catch {
            throw new UnauthorizedException("Couldn't finde any message")
        }
    }

    async getOneMessage(_messageId: number): Promise<Message> {
        try {
            return this.prisma.message.findUnique({ where: { messageId: _messageId } })
        }
        catch {
            throw new UnauthorizedException(`Couldn't finde message with id ${_messageId}`)
        }
    }

    async createMessage(MessageSenId: number, MessageRecId:number, textContent: string) : Promise<Message> {
        // console.log(message.chatId)
        try {
            const message = await this.prisma.message.create({ 
                data: {
                    senId: MessageSenId,
                    recId: MessageRecId,
                    textContent: textContent
                },
            })
            return message
        }
        catch {
            throw new UnauthorizedException("Couldn't create message")
        }
    }
}