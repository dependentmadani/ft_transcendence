import { Injectable, UnauthorizedException } from "@nestjs/common";
// import { Message } from "@prisma/client";
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from "./dto";

@Injectable()
export class MessageService {
    
    constructor(private prisma: PrismaService) {}

    // async getMessages(message: Message): Promise<Message[]> {
    //     try {
    //         const messages = await this.prisma.message.findMany()
    //         return messages
    //     }
    //     catch {
    //         throw new UnauthorizedException("Couldn't finde any message")
    //     }
    // }

    // async getOneMessage(_messageId: number, message: Message): Promise<Message> {
    //     try {
    //         const m = await this.prisma.message.findUnique({ where: { messageId: _messageId } })
    //         return m
    //     }
    //     catch {
    //         throw new UnauthorizedException("Couldn't finde message")
    //     }
    // }

    // async createMessage(message: Message) : Promise<Message> {
    //     // console.log(message.chatId)
    //     try {
    //         const newMessage = await this.prisma.message.create({ 
    //             data: {
    //                 // messageId: message.messageId,
    //                 senderId: message.senderId,
    //                 text: message.text
    //             },
    //         })
    //         return newMessage
    //     }
    //     catch {
    //         throw new UnauthorizedException("Couldn't create message")
    //     }
    // }
}