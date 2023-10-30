import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Chat } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";


@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async getChats() : Promise<Chat[]> {
        try {
            return this.prisma.chat.findMany()
        }
        catch {
            throw new UnauthorizedException("Couldn't find any chat")
        }
    }

    async getOneChat(usrChatId: number) : Promise<Chat[]> {
        try {
            return this.prisma.chat.findMany({
                where: {
                    users: { some: { id: { equals: usrChatId } } },
                  },
            })
        }
        catch {
            throw new UnauthorizedException(`Couldn't find message with id ${usrChatId}`)
        }
    }

    async getChatId(chatId: number) : Promise<Chat> {
        try {
            return this.prisma.chat.findUnique({
                where: {
                    chatId: chatId,
                  },
            })
        }
        catch {
            throw new UnauthorizedException(`Couldn't find chat with id ${chatId}`)
        }
    }

    async getCommunChat(sender: number, receiver: number) : Promise<Chat[]> {
        try {
            return this.prisma.chat.findMany({
                where: {
                    AND: [
                        { users: { some: { id: { equals: sender } } } },
                        { users: { some: { id: { equals: receiver } } } },
                    ]
                  },
            })
        }
        catch (err) {
            throw new UnauthorizedException(`Error getting commun chat between ${sender} and ${receiver} : `, err)
        }
    }

    async createChat(senId: number, recId: number) : Promise<Chat> {
        try {
            const chat = await this.prisma.chat.create({
                data: {
                    // senId: senId,
                    // recId: recId,
                    // usrChatId: usrChatId,
                    chatUsers: [senId, recId]
                }
            })
            await this.prisma.users.update({
                where: {
                    id: senId,
                },
                data: {
                    chat: {
                        connect: {
                            chatId: chat.chatId,
                        }
                    }
                }
            });
            await this.prisma.users.update({
                where: {
                    id: recId,
                },
                data: {
                    chat: {
                        connect: {
                            chatId: chat.chatId,
                        }
                    }
                }
            });
            return chat
        }
        catch {
            throw new UnauthorizedException("Couldn't create chat")
        }
    }

    async deleteAllChats() {
        if (await this.prisma.chat.deleteMany())
            return `All chats deleted successufully!`
        else
            return `Couldn't delete chats!`
    }

    async deleteOneChat(chatId: number) {
        const chat = await this.prisma.chat.findUnique({
            where: {
                chatId: chatId
            }
        })
        if (chat) {
            return await this.prisma.chat.delete({
                where: {
                    chatId: chatId
                }
            })
        }
        else
            return `Couldn't find chat with id ${chatId}`
    }
}