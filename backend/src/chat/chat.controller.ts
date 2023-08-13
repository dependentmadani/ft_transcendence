import { Body, Controller, Get,  Param,  ParseIntPipe,  Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Chat } from "@prisma/client";
import { ChatD } from './dto'

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get()
    async getChats() : Promise<Chat[]> {
        return this.chatService.getChats()
    }

    @Get(':/id')
    async getOneChat(@Param('id', ParseIntPipe) chatId: number) : Promise<string> {
        return this.chatService.getOneChat(chatId)
    }

    @Post()
    async createChat(@Body() chat: { text: string, senderId: number, receiverId: number }) : Promise<Chat> {
        return this.chatService.createChat(chat)
    }
}

