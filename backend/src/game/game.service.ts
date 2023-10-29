import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) {}

    async getInfoGame(userId: number) {
        try {
            const games = await this.prisma.game.findUnique({
                where: {
                    userId: userId,
                }
            });
            return games;
        } catch(e) {
            console.log('Something wrong with database!')
        }
    }

    async updateInfoGame(userId: number, win_state: boolean) {
        try {
            const game = await this.prisma.game.findUnique({
                where: {
                    userId: userId,
                }
            });
            var win = game.wins, lose = game.loses, played = game.gamesPlayed;
            win_state == true ? win++ : lose++;
            played += 1;
            if (win_state == true) {
                let score = game.score + 15;
                const user = await this.prisma.game.update({
                    where: {
                        userId: userId,
                    },
                    data: {
                        score: score,
                    }
                })
            }
            const updatedGames = await this.prisma.game.update({
                where: {
                    userId: userId,
                },
                data: {
                    gamesPlayed: played,
                    wins: win,
                    loses: lose,
                }
            });

            return updatedGames;
        } catch(e) {
            console.log('Something wrong with database!')
        }
    }

    async leaderboard() {
        try {
            const leaderUsers = await this.prisma.users.findMany({
                orderBy: {
                    games: {
                        score: 'desc'
                    }
                },
                take: 10
            })
            return leaderUsers;
        } catch(e) {
            console.log('something wrong with catching leaderboard content')
        }
    }
}
