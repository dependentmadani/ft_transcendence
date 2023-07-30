import { Body, Controller, Post, Req, Get, UseGuards, HttpCode, Res, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { AuthDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { Tokens } from "./types";
import { RtGuard } from "src/guards";
import { GetUser, Public } from "src/decorator";

// TODO: add this installation for password incryption in the laptop: $ npm install -g node-gyp
// $ CXX=g++-12 npm install argon2

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private config: ConfigService) {}
        
    @Public()
    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signupLocal(dto);
    }
    
    @Public()
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.signinLocal(dto);
    }
    
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetUser('sub') userId: number) {
        // console.log(userId)
        return this.authService.logout(userId);
    }

    @Public()
    @Post('refresh')
    @UseGuards(RtGuard)
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetUser('sub') userId: number,
        @GetUser('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(userId, refreshToken);
    }
    
    @Public()
    @Get('42')
    @UseGuards(AuthGuard('42'))
    redirectToFortyTwo() {
    }

    @Public()
    @Get('42/callback')
    @UseGuards(AuthGuard('42'))
    async fortyTwoCallback(@Req() req: Request ,@Res() res:Response ): Promise<void> {
        const user = req.user;
        const tokens = await this.authService.fortyTwo(req.user['users']);
        // console.log('tokens:', tokens)
        res.cookie('access_token', tokens['access_token'], {httpOnly: true})

        res.redirect('http://localhost:8000/users/profile')
        
        // const accesToken = req['user'].accessToken
        // console.log('access_token', accesToken);
        // Handle the callback URL. The actual logic is performed in the FortyTwoStrategy's `validate()` method.
        // res.redirect('/users');
    }

}