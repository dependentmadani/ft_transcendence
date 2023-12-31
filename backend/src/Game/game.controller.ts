import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { GameService } from './game.service';
import { Request } from 'express';

@Controller('game')
export class GameController {
    constructor(private game: GameService) {}

    @Get('info')
    async InfoGame(@Req() req: Request) {
        return this.game.getInfoGame(req.user['sub']);
    }

    @Post('update')
    async updateGame(@Body('game_nums') body: boolean ,@Req() req: Request) {
        return this.game.updateInfoGame(req.user['sub'], body);
    }

    @Get('leaderboard')
    async leaderboard(@Req() req: Request) {
        return await this.game.leaderboard();
    }

    @Get('leaderboard/:username')
    async playerPosition(@Param('username') username: string) {
        return await this.game.playerPosition(username);
    }
}
