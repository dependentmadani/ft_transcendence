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
            throw new UnauthorizedException("Couldn't find any message")
        }
    }

    async getOneMessage(messageId: number): Promise<Message> {
        try {
            return this.prisma.message.findUnique({ where: { messageId: messageId } })
        }
        catch {
            throw new UnauthorizedException(`Couldn't find message with id ${messageId}`)
        }
    }

    async getChatMessage(msgChatId: number): Promise<Message[]> {
        try {
            return this.prisma.message.findMany({ where: { msgChatId: msgChatId } })
        }
        catch {
            throw new UnauthorizedException(`Couldn't find message with id ${msgChatId}`)
        }
    }

    async createMessage(msgChatId: number, MessageSenId: number, MessageRecId:number, textContent: string) : Promise<Message> {
        // console.log(message.chatId)
        try {
            const message = await this.prisma.message.create({ 
                data: {
                    msgChatId: msgChatId,
                    MessageSenId: MessageSenId,
                    MessageRecId: MessageRecId,
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