import { Module } from '@nestjs/common';
import { InvitationsController } from '../invitations/invitations.controller';
import { InvitationsService } from '../invitations/invitations.service';


@Module({
    controllers: [InvitationsController],
    providers: [InvitationsService]
})
export class RoomUsersModule {}
