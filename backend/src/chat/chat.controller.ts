import { Controller, Get,  Post } from "@nestjs/common";

@Controller('chat')
export class ChatController {
    @Get()
    getChats() : string[] {
        return [ 'fir3awn', 's3dia']
    }

    @Get()
    getOneChat() : string {
        return 'mewwwwww'
    }
}

