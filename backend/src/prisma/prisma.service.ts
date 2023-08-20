// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient {
//     constructor(config: ConfigService) {
//         super({
//             datasources: {
//                 db: {
//                     url: config.get('DATABASE_URL'),
//                 },
//             },
//         }); 
//     }

//     cleanDb() {
//         return this.$transaction([
//             this.chat.deleteMany(),
//             this.users.deleteMany(),
//         ])
//     }
// }
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit {

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
  //   this.$on('beforeExit', async () => {
  //     await app.close();
  //   });    
  }
}