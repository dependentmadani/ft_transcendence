import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  UseGuards,
  HttpCode,
  Res,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import {
  AuthDto,
  TwoFaAuthDto,
  TwoFaCodeDto,
} from './dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { GoogleGuard, RtGuard } from 'src/guards';
import { GetUser, Public } from 'src/decorator';
import { Users } from '@prisma/client';

// TODO: add this installation for password incryption in the laptop: $ npm install -g node-gyp
// $ CXX=g++-12 npm install argon2

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {}

  @Get('logged_in')
  loggedIn() {
    return true;
  }

  @Get('me')
  async getMe(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user;
    const userInfo =
      await this.authService.returnUser(
        user['email'],
      );
    return res.send(userInfo);
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signupLocal(
    @Body() dto: AuthDto,
    @Res() res: Response,
  ) {
    const tokens =
      await this.authService.signupLocal(dto);
    res.cookie('token', tokens.access_token, {
      expires: new Date(
        new Date().getTime() + 60 * 60 * 24 * 1000,
      ), // expires in 1 days
      httpOnly: true, // for security
      secure: true,
    });
    res.cookie(
      'refresh_token',
      tokens.refresh_token,
      {
        expires: new Date(
          new Date().getTime() +
            60 * 60 * 24 * 7 * 1000,
        ), // expires in 7 days
        httpOnly: true, // for security
        secure: true,
      },
    );
    res.send('the user signup successfully!');
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() dto: AuthDto,
    @Res() res: Response,
  ) {
    const tokens =
      await this.authService.signinLocal(dto);
    res.cookie('token', tokens.access_token, {
      expires: new Date(
        new Date().getTime() + 60 * 60 * 24 * 1000,
      ), // expires in 1 days
      httpOnly: true, // for security
      secure: true,
    });
    res.cookie(
      'refresh_token',
      tokens.refresh_token,
      {
        expires: new Date(
          new Date().getTime() +
          60 * 60 * 24 * 7 * 1000,
          ), // expires in 7 days
        httpOnly: true, // for security
        secure: true,
      },
    );
    res.send('the user signin');
  }

  @Public()
  @Get('google_auth')
  @UseGuards(GoogleGuard)
  async signinGoogle() {
    return;
  }

  @Public()
  @Get('google_auth/redirect')
  @UseGuards(GoogleGuard)
  async signinGoogleRedirection(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user;
    const tokens =
      await this.authService.signinGoogle(req);
    res.cookie('token', tokens.access_token, {
      expires: new Date(
        new Date().getTime() + 60 * 60 * 24 * 1000,
      ), // expires in 1 days
      httpOnly: true, // for security
      secure: true,
    });
    res.cookie(
      'refresh_token',
      tokens.refresh_token,
      {
        expires: new Date(
          new Date().getTime() +
          60 * 60 * 24 * 7 * 1000,
        ), // expires in 7 days
        httpOnly: true, // for security
        secure: true,
      },
    );
    const userNew =
      await this.authService.returnUser(
        user['users'].email,
      );
    await this.authService.updateUserState(
      userNew.id,
      true,
      'ONLINE'
    );
    res.send('logged successfully!');
    // console.log(
    //   'vite address 1:',
    //   process.env.VITE_ADDRESS,
    // );
    // res.redirect(
    //   `http://${process.env.VITE_ADDRESS}:5173/`,
    // );
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetUser('sub') userId: number,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.authService.logout(userId, req.cookies);
    if (req.cookies['token']) {
      res.cookie('token', req.cookies['token'], {
        expires: new Date(0),
      });
      res.cookie(
        'refresh_token',
        req.cookies['refresh_token'],
        { expires: new Date(0) },
      );
    }
    const userNew =
      await this.authService.returnUser(
        req.user['email'],
      );
    await this.authService.updateUserState(
      userNew.id,
      false,
      'OFFLINE'
    );

    res.redirect(
      `http://${process.env.VITE_ADDRESS}:5173/`,
    );
  }

  @Get('refresh')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetUser('sub') userId: number,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(
      userId,
      refreshToken,
    );
  }

  @Post('2fa/setup')
  @HttpCode(HttpStatus.CREATED)
  async enable2fa(
    @Body() body: TwoFaAuthDto,
    @Req() req: Request,
  ) {
    const user: Users =
      await this.authService.returnUser(
        req.user['email'],
      );
    return this.authService.enable2fa(body, user);
  }

  @Post('2fa/verify')
  @HttpCode(HttpStatus.FOUND)
  async verify2fa(
    @Body() body: TwoFaCodeDto,
    @Req() req: Request,
  ) {
    const user: Users =
      await this.authService.returnUser(
        req.user['email'],
      );
    if (
      await this.authService.verify2fa(body, user)
    )
      return this.authService.isEnable2fa(user);
    throw new UnauthorizedException(
      'code is wrong, try again',
    );
  }

  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  async disable2fa(@Req() req: Request) {
    const user: Users =
      await this.authService.returnUser(
        req.user['email'],
      );
    if (await this.authService.disable2fa(user))
      return 'Disabled successfuly';
    throw new UnauthorizedException(
      'weird error',
    );
  }

  @Public()
  @Get('42')
  @UseGuards(AuthGuard('42'))
  redirectToFortyTwo() {
    return;
  }

  @Public()
  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const user = req.user;
    const [tokens, state] =
      await this.authService.fortyTwo(
        req.user['users'],
      );
    res.cookie('token', tokens.access_token, {
      expires: new Date(
        new Date().getTime() + 60 * 60 * 24 * 1000,
      ), // expires in 1 day
      httpOnly: true, // for security
      secure: true,
    });
    res.cookie(
      'refresh_token',
      tokens.refresh_token,
      {
        expires: new Date(
          new Date().getTime() +
            60 * 60 * 24 * 7 * 1000,
        ), // expires in 7 days
        httpOnly: true, // for security
        secure: true,
      },
    );
    const userNew =
      await this.authService.returnUser(
        user['users'].email,
      );
    await this.authService.updateUserState(
      userNew.id,
      true,
      'ONLINE'
    );
    if (state)
      res.redirect(
        `http://${process.env.VITE_ADDRESS}:5173/signup`,
      );
    else
      res.redirect(
        `http://${process.env.VITE_ADDRESS}:5173/`,
      );
  }
}
