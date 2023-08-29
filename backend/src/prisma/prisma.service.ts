import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Room } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    // room: Room;
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                },
            },
        }); 
    }

    cleanDb() {
        return this.$transaction([
            this.chat.deleteMany(),
            this.users.deleteMany(),
        ])
    }
}
