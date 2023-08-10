import { Body, Controller, Get, Post } from "@nestjs/common";
import { MessageService } from "./message.service";

@Controller()
export class MessageController {
    constructor(private readonly messageService: MessageService) {}
    
    @Get()
    getMessages() : string[] {
        return this.messageService.getMessages()
    }

    @Get()
    getOneMessage() : string {
        return this.messageService.getOneMessage()
    }

    // @Post()
    // async createMessage( @Body('chatId') chatId: string, @Body('senderId') senderId: string, @Body('text') text: string ) : string {
    //     console.log(text)
    //     return this.messageService.createMessage(chatId, senderId, text)
    // }
}