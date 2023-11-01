import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { historyDto } from './dto';
import { error } from 'console';

@Injectable()
export class HistoryService {
    constructor(private prisma: PrismaService) {}

    async getLatestGames(userId: number) {
        try {
            const latest = this.prisma.history.findMany({
                take: 10, 
                where: {
                    myUserId: userId,
                },
                orderBy: {
                    id: 'desc',
                },
                include: {
                    myUser: true,
                    oppUser: true,
                }
            });

            return latest;
        } catch(error) {
            console.log(`Something wrong happend with database2222222${error}`);
        }

    }

    async createResultGame(userId: number, body: historyDto) {
        try {
            const oppUser = await this.prisma.users.findUnique({
                where: {
                    username: body.opp_name,
                }
            });
            if (!oppUser) {
                throw new UnauthorizedException("The username is not available");
            }
            const newGameAdded = await this.prisma.history.create({
                data: {
                    myUserId: userId,
                    oppUserId: oppUser?.id,
                    myScore: body.my_score,
                    oppScore: body.opp_score
                }
            });
            return 'The history game added successfully';
        } catch (err) {
            console.log(`Something wrong happend with database${err}`);
        }
    }

}

