import { Body, Injectable, UnauthorizedException, Res, Req, HttpStatus } from "@nestjs/common";
import { Chat } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { Request } from "express";


@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async getChats() : Promise<Chat[]> {
        try {
            return this.prisma.chat.findMany()
        }
        catch {
            throw new UnauthorizedException("Couldn't finde any chat")
        }
    }

    async getOneChat(chatId: number) : Promise<Chat> {
        try {
            return this.prisma.chat.findUnique({ where: { chatId: chatId } })
        }
        catch {
            throw new UnauthorizedException(`Couldn't finde message with id ${chatId}`)
        }
    }

    async createChat(senId: number, recId: number, usrChatId: number) : Promise<Chat> {
        try {
            const chat = await this.prisma.chat.create({
                data: {
                    senId: senId,
                    recId: recId,
                    usrChatId: usrChatId,
                }
            })
            return chat
        }
        catch {
            throw new UnauthorizedException("Couldn't create chat")
        }
    }
}