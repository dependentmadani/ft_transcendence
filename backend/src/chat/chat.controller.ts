import { Body, Controller, Get,  Param,  ParseIntPipe,  Post, Res, Req, HttpStatus } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Request, Response } from "express";
import { Chat } from "@prisma/client";
import { Public } from "src/decorator";
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
                        @Body('msg') msg: string) : Promise<Chat> {
        return this.chatService.createChat(Number(senId), Number(recId), msg)
    }

    @Get(':/id')
    async getOneChat(@Param('id', ParseIntPipe) chatId: number) : Promise<string> {
        return this.chatService.getOneChat(chatId)
    }

}

