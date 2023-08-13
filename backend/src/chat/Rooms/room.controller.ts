import { Controller, Get } from "@nestjs/common";

@Controller('room')
export class roomController {
    constructor() {}

    @Get()
    getRoom() {
        
    }
}