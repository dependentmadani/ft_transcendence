import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { Request } from 'express';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { historyDto } from './dto';

@Controller('history')
export class HistoryController {
    constructor(private history: HistoryService) {}

    //Get all last 10 games score
    @Get()
    @ApiBody({
        description: 'no body is needed here'
    })
    @ApiResponse({
        status: 200,
        description: 'return latest 10 games'
    })
    async getLatestGames(@Req() req: Request) {
        const user = req.user;
        return await this.history.getLatestGames(user['sub']);
    }

    //add new result score to history table
    @Post('add-result')
    @ApiBody({
        description: 'opp_name, opp_score and my_score parameters should be sent in body'
    })
    @ApiResponse({
        status: 201,
        description: 'add game result in the history'
    })
    @HttpCode(HttpStatus.CREATED)
    async addResultGame(@Req() req: Request, 
            @Body() body: historyDto) {
        const user = req.user;
        return await this.history.createResultGame(user['sub'], body);
    }

}
