import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Invitations } from '@prisma/client'

@Injectable()
export class InvitationsService {
    constructor(private prisma: PrismaService) {}

    async getInvitations(): Promise<Invitations[]> {
        try {
            return this.prisma.invitations.findMany()
        }
        catch (err) {
            throw new UnauthorizedException(`Couldn't find any Invitation: `, err)
        }
    }

    async getOneInvitation(receiver: number) : Promise<Invitations[]> {
        try {
            return this.prisma.invitations.findMany({
                where: {
                    receiverId: receiver,
                  },
            })
        }
        catch {
            throw new UnauthorizedException(`Couldn't find invitation for id ${receiver}`)
        }
    }

    async createInvitation(sender: number, receiver: number, roomId: number) : Promise<Invitations> {
        try {
            const invitation = await this.prisma.invitations.create({
                data: {
                    senderId: sender,
                    receiverId: receiver,
                    roomId: roomId,
                }
            })
            // await this.prisma.users.update({
            //     where: {
            //         id: receiver,
            //     },
            //     data: {
            //         invitations: {
            //             connect: {
            //                 roomId: invitations.id,
            //             }
            //         }
            //     }
            // });
            // await this.prisma.room.update({
            //     where: {
            //         id: roomId,
            //     },
            //     data: {
            //         room: {
            //             connect: {
            //                 roomId: invitations.id,
            //             }
            //         }
            //     }
            // });
            return invitation
        }
        catch {
            throw new UnauthorizedException("Couldn't create invitation")
        }
    }

    async deleteAllInvitations() {
        if (await this.prisma.invitations.deleteMany())
            return `All invitations deleted successufully!`
        else
            return `Couldn't delete invitations!`
    }

    async deleteOneInvitation(invitationId: number) {
        const invitation = await this.prisma.invitations.findUnique({
            where: {
                id: invitationId
            }
        })
        if (invitation) {
            return await this.prisma.invitations.delete({
                where: {
                    id: invitationId
                }
            })
        }
        else
            return `Couldn't find invitation with id ${invitationId}`
    }
}
