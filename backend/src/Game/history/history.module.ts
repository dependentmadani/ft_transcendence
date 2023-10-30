import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  providers: [HistoryService, PrismaService,],
  controllers: [HistoryController]
})
export class HistoryModule {}
