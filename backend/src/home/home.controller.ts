import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/decorator';

@Controller('')
@Public()
export class HomeController {
    constructor() {}

    @Get('')
    getHome() {
        return 'welcome home :)'
    }
}
