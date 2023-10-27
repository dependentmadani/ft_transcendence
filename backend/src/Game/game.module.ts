import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';


import { ClassicSocketGateway } from './websocket/Classicsocket.gateway';
import { MatchSocketGateway } from './websocket/MatchSocket.gateway';
import { InviteMatchSocketGateway } from './websocket/InviteMatch.gateway';
import { InviteClassicSocketGateway } from './websocket/InviteClassic.gateway';

import { HistoryModule } from './history/history.module';
import { HistoryService } from './history/history.service';
import {historyDto} from './history/dto'

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [GameController],
  providers: [GameService, historyDto,HistoryService,PrismaService,ClassicSocketGateway,
        MatchSocketGateway,InviteMatchSocketGateway,InviteClassicSocketGateway]
})
export class GameModule {}

