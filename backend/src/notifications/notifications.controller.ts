import { Body, Controller, Get,  Param,  ParseIntPipe,  Post, Res, Req, HttpStatus, Delete, Put, Patch } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { Request, Response } from "express";
import { Public } from "src/decorator";
import { NotificationsGateway } from "./notifications.gateway";
import { Notifications } from "@prisma/client";
import { NotificationDto, FriendDto } from "./dto/create-notification.dto";
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

    @Post('friendAcception')
    async friendAcception(@Body() body: FriendDto) {
        console.log('------------------------------')
        console.log('boyd', body)
        return this.notificationService.acceptFriend(body.senderId, body.receiverId, body.notifId)
    }

    @Put('/:id')
    async updateNotification(@Param('id', ParseIntPipe) id: number) {
        console.log('uui')
        return await this.notificationService.updateNotification(id)
    }

    // @Delete()
    // async deleteAllChats() {
    //     return this.chatService.deleteAllChats()
    // }
    
    @Delete('/:id')
    async deleteNotification(@Param('id', ParseIntPipe) id: number) {
        return this.notificationService.deleteNotification(id)
    }
}
