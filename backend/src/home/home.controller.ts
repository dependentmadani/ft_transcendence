import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/decorator';

@Controller('')
@Public()
export class HomeController {

  @Get('')
  getHome() {
    return 'welcome home :)';
  }
}
