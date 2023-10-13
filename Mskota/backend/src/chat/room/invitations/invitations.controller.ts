import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Public } from 'src/decorator';
import { InvitationsService } from './invitations.service';
import { Invitations } from '@prisma/client'

@Controller('invitations')
export class InvitationsController {
    constructor(private invitaionsService: InvitationsService) {}

    @Get()
    async getInvitations(): Promise<Invitations[]> {
        return this.invitaionsService.getInvitations()
    }

    @Get('/:receiver')
    async getOneInvitation(@Param('receiver', ParseIntPipe) receiver: number) : Promise<Invitations[]> {
        return this.invitaionsService.getOneInvitation(receiver)
    }

    @Post()
    async createInvitation(@Body('sender', ParseIntPipe) sender: number,
                    @Body('receiver', ParseIntPipe) receiver: number,
                    @Body('roomId', ParseIntPipe) roomId: number) : Promise<Invitations> {
        return this.invitaionsService.createInvitation(sender, receiver, roomId)
    }

    @Delete()
    async deleteAllInvitations() {
        return this.invitaionsService.deleteAllInvitations()
    }
    
    @Delete('/:id')
    async deleteOneInvitation(@Param('id', ParseIntPipe) id: number) {
        return this.invitaionsService.deleteOneInvitation(id)
    }
}
