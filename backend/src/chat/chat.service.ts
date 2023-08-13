import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Chat } from "@prisma/client";
import { ChatD } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async getChats() : Promise<Chat[]> {
        console.log('Chats ->', this.prisma.chat.findMany())
        return this.prisma.chat.findMany()
    }

    async getOneChat(chatId: number) : Promise<string> {
        return ''
    }

    async createChat(chat: { text: string; senderId: number; receiverId: number }) : Promise<Chat> {
        console.log('data: ->', chat.text, chat.senderId, chat.receiverId)
        try {
            const _chat = await this.prisma.chat.create({ data: chat })
            return _chat
        }
        catch {
            throw new UnauthorizedException("Couldn't create chat")
        }
    }
}