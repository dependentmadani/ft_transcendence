import { Body, Controller, Get,  Param,  ParseIntPipe,  Post, Res, Req, HttpStatus, Delete, Put, Patch } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { Request, Response } from "express";
import { Public } from "src/decorator";
import { NotificationsGateway } from "./notifications.gateway";
import { Notifications } from "@prisma/client";
import { NotificationDto } from "./dto/create-notification.dto";
// import { Chat } from './dto'

@Controller('notifications')
export class NotificationController {
    constructor(private notificationService: NotificationsService) {}

    @Get()
    async getNotifications() : Promise<Notifications[]> {
        return this.notificationService.getNotifications()
    }

    // @Get('/isFound/:senderId/:receiverId')
    // async isNotifFound(@Param('senderId', ParseIntPipe) senderId: number,
    //                     @Param('receiverId', ParseIntPipe) receiverId: number) : Promise<boolean> {
    //     return this.notificationService.isNotifFound(senderId, receiverId)
    // }
 
    // @Get()
    // getTestChats() : string[] {
    //     return this.chatService.getTestChats();
    // }
    // @Get('id/:chatId')
    // async getChatId(@Param('chatId', ParseIntPipe) chatId: number) : Promise<Chat> {
    //     return this.chatService.getChatId(chatId)
    // }

    // @Get('/:usrChatId')
    // async getOneChat(@Param('usrChatId', ParseIntPipe) usrChatId: number) : Promise<Chat[]> {
    //     return this.chatService.getOneChat(usrChatId)
    // }

    // @Get('/:sender/:receiver')
    // async getCommunChat(@Param('sender', ParseIntPipe) sender: number,
    //                     @Param('receiver', ParseIntPipe) receiver: number) : Promise<Chat[]> {
    //     return this.chatService.getCommunChat(sender, receiver)
    // }

    @Post()
    async createNotification(@Body('type') type: any,
                            @Body('read') read: boolean,
                            @Body('receiverId', ParseIntPipe) receiverId: number,
                            @Body('senderId', ParseIntPipe) senderId: number,
                            @Body('mode') mode: string) : Promise<Notifications> {
        return this.notificationService.createNotification(type, read, receiverId, senderId, mode)
    }

    @Put('/state/:id')
    async updateNotification(@Param('id', ParseIntPipe) id: number) : Promise<Notifications> {
        console.log('uui')
        return this.notificationService.updateNotification(id)
    }

    @Put('/friendAcception')
    async friendAcception(@Body('senderId', ParseIntPipe) senderId: number,
                                @Body('receiverId', ParseIntPipe) receiverId: number,
                                @Body('notifId', ParseIntPipe) notifId: number) : Promise<Notifications> {
        return this.notificationService.friendAcception(senderId, receiverId, notifId)
    }


    // @Delete()
    // async deleteAllChats() {
    //     return this.chatService.deleteAllChats()
    // }
    
    // @Delete('/:chatId')
    // async deleteChat(@Param('chatId', ParseIntPipe) chatId: number) {
    //     return this.chatService.deleteOneChat(chatId)
    // }
}

