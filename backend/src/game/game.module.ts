import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [GameController],
  providers: [GameService, PrismaService]
})
export class GameModule {}
