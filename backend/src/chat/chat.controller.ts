import { Body, Controller, Get,  Param,  ParseIntPipe,  Post, Res, Req, HttpStatus } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Request, Response } from "express";
import { Chat } from "@prisma/client";
import { Public } from "src/decorator";
import { ChatGateway } from "./chat.gateway";
// import { Chat } from './dto'

@Public()
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get()
    async getChats() : Promise<Chat[]> {
        return this.chatService.getChats()
    }
 
    // @Get()
    // getTestChats() : string[] {
    //     return this.chatService.getTestChats();
    // }
    @Post()
    async createChat(@Body("senId", ParseIntPipe) senId: number,
                    @Body('recId', ParseIntPipe) recId: number,
                    @Body('usrChatId', ParseIntPipe) usrChatId: number) : Promise<Chat> {
        return this.chatService.createChat(senId, recId, usrChatId)
    }

    @Get('/:usrChatId')
    async getOneChat(@Param('usrChatId', ParseIntPipe) usrChatId: number) : Promise<Chat[]> {
        return this.chatService.getOneChat(usrChatId)
    }
}

