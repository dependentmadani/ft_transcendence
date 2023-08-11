import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { MessageService } from "./message.service";
// import { Message } from "./dto";
import { Message } from "@prisma/client";

@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) {}
    
    // @Get()
    // async getMessages( @Body() message: Message ) : Promise<Message[]> {
    //     return this.messageService.getMessages(message)
    // }

    // @Get('/:id')
    // async getOneMessage( @Param('id', ParseIntPipe) messageId, @Body() message: Message ) : Promise<Message> {
    //     return this.messageService.getOneMessage(messageId, message)
    // }

    // @Post()
    // async createMessage(@Body() message: Message) : Promise<Message> {
    //     return this.messageService.createMessage(message)
    // }
}