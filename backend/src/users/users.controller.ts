import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Public } from 'src/decorator';
import { Authenticated } from 'src/decorator/authenticated.decorator';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
    
    constructor(private authService: AuthService) {}

    @Public()
    @Get("/")
    getUser(@Req() req: Request): string {
        
        return "successfull authentification";
    }

    @Public()
    @Authenticated()
    @Get('/me')
    getMe() {
        return 'all seem to be awesome';
    }

    @Public()
    @Get('logout')
    getOut(@Req() req: Request, @Res() res: Response): string {
        // console.log('cookies:',req.cookies);
        // this.authService.logout(req.user.id);
        // res.clearCookie('access_token', {httpOnly: true});
        res.cookie('access_token', req.cookies['access_token'], {expires: new Date(0)})
        res.redirect('http://localhost:8000/users/profile')
        return "should logout";
    }
    
    @Public()
    @Get("/signup")
    getSingup(@Req() req: Request, @Res() res: Response): string {
        return "all seem to be good";
    }

    @Public()
    // @UseGuards(AuthGuard('jwt'))
    @Get("/profile")
    getHome() {
        return "this is home page";
    }


}

//TODO: need to check that username is "unique" in the database when sign up