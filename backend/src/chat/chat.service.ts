import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Chat, Message, Users } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "src/users/users.service";


@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService, private userService: UsersService) {}


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

    async getUserChats(id: number) : Promise<Chat[]> {
        try {
            return this.prisma.chat.findMany({
                where: {
                    users: { some: { id: { equals: id } } },
                  },
            })
        }
        catch {
            throw new UnauthorizedException(`Couldn't find message with id ${id}`)
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

    async getCommunChat(sender: number, receiver: number) : Promise<Chat> {
        try {
            const communChat = await this.prisma.chat.findMany({
                where: {
                    AND: [
                        { users: { some: { id: { equals: sender } } } },
                        { users: { some: { id: { equals: receiver } } } },
                    ]
                  },
            })

            if (communChat)
                return communChat[0]
        }
        catch (err) {
            throw new UnauthorizedException(`Error getting commun chat between ${sender} and ${receiver} : `, err)
        }
    }

    async createChat(me: number, senId: number, recId: number) {
        
        try {

            const _chat = await this.getCommunChat(senId, recId)
            if (_chat)
                throw new UnauthorizedException(`Chat already exists`)

            const chat = await this.prisma.chat.create({
                data: {
                    // senId: senId,
                    // recId: recId,
                    // usrChatId: usrChatId,
                    chatUsers: [senId, recId],
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

            const receiver = chat.chatUsers[0] === me ? chat.chatUsers[1] : chat.chatUsers[0];
            const _receiver: Users = await this.userService.findUserById(receiver);
            const contact =  { id: chat.chatId, name: _receiver.username, avatar: _receiver.avatar, latestMessageContent: chat.latestMessageContent, latestMessageDate: chat.latestMessageDate, type: 'Chat' };
            
            return contact
        }
        catch (err) {
            throw new UnauthorizedException("Couldn't create chat", err)
        }
    }

    async updateLastMessage(id: number, content: string) {
        try {
            return await this.prisma.chat.update({
                where: {
                    chatId: id,
                },
                data: {
                    latestMessageContent: content,
                    latestMessageDate: new Date(),
                }
            })
        }
        catch {
            throw new UnauthorizedException("Couldn't update chat")
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