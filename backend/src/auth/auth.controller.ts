import { Body, Controller, Post, Req, Get, UseGuards, HttpCode, Res, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { AuthDto, TwoFaAuthDto, TwoFaCodeDto } from "./dto";
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
    signinLocal(@Body() dto: AuthDto, @Res() res: Response): Promise<Tokens> {
        return this.authService.signinLocal(dto);
    }

    @Get('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetUser('sub') userId: number,
            @Res() res: Response,
            @Req() req: Request): void {
        
        this.authService.logout(userId, req.cookies);
        if (req.cookies['token']) {
            res.cookie('token', req.cookies['token'], {expires: new Date(0)})
            res.cookie('refresh_token', req.cookies['refresh_token'], {expires: new Date(0)})
        }
        res.redirect('http://localhost:8000/');
    }

    @Get('refresh')
    @UseGuards(RtGuard)
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetUser('sub') userId: number,
        @GetUser('refreshToken') refreshToken: string) {
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @Post('2fa/setup')
    @HttpCode(HttpStatus.CREATED)
    enable2fa(@Body() body: TwoFaAuthDto, @Req() req: Request) {
        return this.authService.enable2fa(body, req.user);
    }

    @Post('2fa/verify')
    @HttpCode(HttpStatus.FOUND)
    async verify2fa(@Body() body: TwoFaCodeDto, @Req() req: Request) {
        if (await this.authService.verify2fa(body, req.user))
            return this.authService.isEnable2fa(req.user);
        throw new UnauthorizedException('code is wrong, try again');
    }

    @Post('2fa/disable')
    @HttpCode(HttpStatus.OK)
    async disable2fa(@Req() req: Request) {
        if (await this.authService.disable2fa(req.user))
            return 'Disabled successfuly';
        throw new UnauthorizedException('weird error');
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
        res.cookie("token", tokens.access_token, {
            
            expires: new Date(new Date().getTime() + 60 * 60 * 24 * 7), // expires in 7 days
            httpOnly: true, // for security
            secure: true
        });
        res.cookie("refresh_token", tokens.refresh_token, {

            expires: new Date(new Date().getTime() + 60 * 60 * 24 * 60), // expires in 60 days
            httpOnly: true, // for security
            secure: true
        });
        const userId = await this.authService.returnUser(user['users'].email);
        res.redirect('http://localhost:8000/')
        // console.log('access_token', tokens.access_token)
        // res.json({accessToken});
        
        // const accesToken = req['user'].accessToken
        // console.log('access_token', accesToken);
        // Handle the callback URL. The actual logic is performed in the FortyTwoStrategy's `validate()` method.
        // res.redirect('/users');
    }

}