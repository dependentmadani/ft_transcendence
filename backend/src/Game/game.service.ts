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
    
    async updateInfoGame(userId: number, win_state: boolean) {
        try {
            let game = await this.prisma.game.findUnique({
                where: {
                    userId: userId,
                },
            });
    
            if (!game)
            {
                game = await this.prisma.game.create({
                    data: {
                        userId: userId,
                        gamesPlayed: 0,
                        wins: win_state ? 1 : 0,
                        loses: win_state ? 0 : 1,
                    },
                });
            }
            else
            {
                // let { wins, loses, gamesPlayed } = game;
                let win = game.wins;
                let lose = game.loses;
                let played = game.gamesPlayed;
    
                if (win_state) 
                    win++;
                else 
                    lose++;
                played++;
                game = await this.prisma.game.update({
                    where: {
                        userId: userId,
                    },
                    data: {
                        gamesPlayed: played,
                        wins: win,
                        loses: lose,
                    },
                });
            }
    

            return game;
        } catch (e) {
            console.error(`Something went wrong with the database: ${e}`);
            // Handle the error appropriately
        }
    }
}    


//     async updateInfoGame(userId: number, win_state: boolean){
//         try {
//             const game = await this.prisma.game.findUnique({
//                 where: {
//                     userId: userId,
//                 }
//             });
//             let win = game.wins;
//             let lose = game.loses;
//             let played = game.gamesPlayed;

//             win_state == true ? win++ : lose++;
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
//         } catch(e) {
//             console.log(`Something wrong with database! ?????? ${e}`)
//         }
//     }
// }

