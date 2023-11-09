import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { MessageService } from "./message.service";
import { Public } from "src/decorator";
import { Message } from "@prisma/client";

@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) {}
    
    @Get()
    async getMessages() : Promise<Message[]> {
        return this.messageService.getMessages()
    }

    // @Get('/:id')
    // async getOneMessage(@Param('id', ParseIntPipe) messageId) : Promise<Message> {
    //     return this.messageService.getOneMessage(messageId)
    // }

    @Get('Chat/:chatId')
    async getChatMessages(@Param('chatId', ParseIntPipe) chatId) : Promise<Message[]> {
        return this.messageService.getChatMessages(chatId)
    }

    @Get('Room/:id')
    async getRoomMessages(@Param('id', ParseIntPipe) roomId) : Promise<Message[]> {
        return this.messageService.getRoomMessages(roomId)
    }

    @Post('Chat')
    async createChatMessage(@Body("msgChatId", ParseIntPipe) msgChatId: number,
                        @Body("MessageSenId", ParseIntPipe) MessageSenId: number,
                        @Body('textContent') textContent: string,
                        @Body('type') type: string) : Promise<Message> {
        return this.messageService.createChatMessage(msgChatId, MessageSenId, textContent, type)
    }

    @Post('Room')
    async createRoomMessage(@Body("msgRoomId", ParseIntPipe) msgRoomId: number,
                        @Body("MessageSenId", ParseIntPipe) MessageSenId: number,
                        @Body('textContent') textContent: string,
                        @Body('type') type: string) : Promise<Message> {
        return this.messageService.createRoomMessage(msgRoomId, MessageSenId, textContent, type)
    }
}