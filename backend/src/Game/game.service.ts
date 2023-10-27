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
            console.log(`Something wrong with database! !!!!!!! ${e}`)
        }
    }


    async updateInfoGame(userId: number, win_state: boolean){
        try {
            const game = await this.prisma.game.findUnique({
                where: {
                    userId: userId,
                }
            });
            let win = game.wins, lose = game.loses, played = game.gamesPlayed;
            win_state == true ? win++ : lose++;
            played += 1;
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
            console.log(`Something wrong with database! ?????? ${e}`)
        }
    }
}


// async updateInfoGame(userId: number, win_state: boolean)
// {
//     try {
//         const game = await this.prisma.game.findUnique({
//             where: {
//                 userId: userId,
//             }
//         });

//         if (game) {
//             let win = game.wins || 0;
//             let lose = game.loses || 0;
//             let played = game.gamesPlayed || 0;

//             if (win_state) {
//                 win++;
//             } else {
//                 lose++;
//             }
            
//             played += 1;

//             const updatedGames = await this.prisma.game.update({
//                 where: {
//                     userId: userId,
//                 },
//                 data: {
//                     gamesPlayed: played,
//                     wins: win,
//                     loses: lose,
//                 }
//             });

//             return updatedGames;
//         } else {
//             // Handle the case when the user does not exist in the database
//             console.log(`User with userId ${userId} does not exist in the database.`);
//         }
//     } catch(e) {
//         console.log(`Something wrong with the database: ${e}`);
//     }
// }
// }