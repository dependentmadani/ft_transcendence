import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { historyDto } from './dto';
import { error } from 'console';
import { GameService } from '../game.service';

@Injectable()
export class HistoryService {
    constructor(private prisma: PrismaService,
        private game: GameService) {}

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
            console.log(`Something wrong happend with database ${error}`);
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
            await this.prisma.history.create({
                data: {
                    myUserId: oppUser?.id,
                    oppUserId: userId,
                    myScore: body.opp_score,
                    oppScore: body.my_score
                }
            });
            if (newGameAdded.myScore > newGameAdded.oppScore) {
                await this.game.updateInfoGame(newGameAdded.myUserId, true);
                await this.game.updateInfoGame(newGameAdded.oppUserId, false);
            }
            else {
                await this.game.updateInfoGame(newGameAdded.myUserId, false);
                await this.game.updateInfoGame(newGameAdded.oppUserId, true);
            }
            return 'The history game added successfully';
        } catch (err) {
            console.log(`Something wrong happend with database ${err}`);
        }
    }

}

