import { Body, Controller, Get,  Param,  ParseIntPipe,  Post, Res, Req, HttpStatus, Delete } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Request, Response } from "express";
import { Chat } from "@prisma/client";
import { Public } from "src/decorator";
import { ChatGateway } from "./chat.gateway";
// import { Chat } from './dto'

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
    @Get('id/:chatId')
    async getChatId(@Param('chatId', ParseIntPipe) chatId: number) : Promise<Chat> {
        return this.chatService.getChatId(chatId)
    }

    @Get('/:usrChatId')
    async getOneChat(@Param('usrChatId', ParseIntPipe) usrChatId: number) : Promise<Chat[]> {
        return this.chatService.getOneChat(usrChatId)
    }

    @Get('/:sender/:receiver')
    async getCommunChat(@Param('sender', ParseIntPipe) sender: number,
                        @Param('receiver', ParseIntPipe) receiver: number) : Promise<Chat[]> {
        return this.chatService.getCommunChat(sender, receiver)
    }

    @Post()
    async createChat(@Body("senId", ParseIntPipe) senId: number,
                    @Body('recId', ParseIntPipe) recId: number) : Promise<Chat> {
        return this.chatService.createChat(senId, recId)
    }


    @Delete()
    async deleteAllChats() {
        return this.chatService.deleteAllChats()
    }
    
    @Delete('/:chatId')
    async deleteChat(@Param('chatId', ParseIntPipe) chatId: number) {
        return this.chatService.deleteOneChat(chatId)
    }
}

