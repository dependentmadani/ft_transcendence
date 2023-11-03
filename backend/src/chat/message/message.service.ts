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

    async getChatMessages(chatId: number): Promise<Message[]> {
        try {
            return this.prisma.message.findMany({ where: {
                AND: [
                    { msgChatId: chatId },
                    { type: 'Chat' },
                ]
            } })
        }
        catch {
            throw new UnauthorizedException(`Couldn't find message in chat with id ${chatId}`)
        }
    }

    async getRoomMessages(roomId: number): Promise<Message[]> {
        try {
            return this.prisma.message.findMany({ where: {
                AND: [
                    { msgRoomId: roomId },
                    { type: 'Room' },
                ]
            } })
        }
        catch {
            throw new UnauthorizedException(`Couldn't find message in room with id ${roomId}`)
        }
    }

    async createChatMessage(msgChatId: number, MessageSenId: number, textContent: string, type: string) : Promise<Message> {
        // console.log(message.chatId)
        try {
            const message = await this.prisma.message.create({ 
                data: {
                    textContent: textContent,
                    msgChatId: msgChatId,
                    MessageSenId: MessageSenId,
                    // MessageRecId: MessageRecId,
                    type: type,
                },
            })
            return message
        }
        catch {
            throw new UnauthorizedException("Couldn't create message")
        }
    }

    async createRoomMessage(msgRoomId: number, MessageSenId: number, textContent: string, type: string) : Promise<Message> {
        // console.log(message.chatId)
        try {
            const message = await this.prisma.message.create({ 
                data: {
                    textContent: textContent,
                    msgRoomId: msgRoomId,
                    MessageSenId: MessageSenId,
                    // MessageRecId: MessageRecId,
                    type: type,
                },
            })
            return message
        }
        catch {
            throw new UnauthorizedException("Couldn't create message")
        }
    }
}