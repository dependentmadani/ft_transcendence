import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Chat } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async getChats() : Promise<Chat[]> {
        console.log(this.prisma.chat.findMany())
        return this.prisma.chat.findMany()
    }

    async getOneChat(chatId: number) : Promise<string> {
        return ''
    }

    async createChat(data: Chat) : Promise<Chat> {
        try {
            const _chat = await this.prisma.chat.create({ data })
            return _chat
        }
        catch {
            throw new UnauthorizedException("Couldn't create chat")
        }
    }
}