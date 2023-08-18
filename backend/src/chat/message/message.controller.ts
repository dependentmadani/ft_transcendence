import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { MessageService } from "./message.service";
import { Public } from "src/decorator";
import { Message } from "@prisma/client";

@Public()
@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) {}
    
    @Get()
    async getMessages() : Promise<Message[]> {
        return this.messageService.getMessages()
    }

    @Get('/:id')
    async getOneMessage(@Param('id', ParseIntPipe) messageId) : Promise<Message> {
        return this.messageService.getOneMessage(messageId)
    }

    @Post()
    async createMessage(@Body("msgChatId", ParseIntPipe) msgChatId: number,
                        @Body("MessageSenId", ParseIntPipe) MessageSenId: number,
                        @Body('MessageRecId', ParseIntPipe) MessageRecId: number,
                        @Body('textContent') textContent: string) : Promise<Message> {
        return this.messageService.createMessage(msgChatId, MessageSenId, MessageRecId, textContent)
    }
}