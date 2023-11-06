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
import { ApiBody, ApiResponse } from '@nestjs/swagger';

// TODO: add this installation for password incryption in the laptop: $ npm install -g node-gyp
// $ CXX=g++-12 npm install argon2

const oneDay = 1000 * 60 * 60 * 24;
const oneWeek= 1000 * 60 * 60 * 24 * 7;

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

  @Get('signed_up')
  async signedUp(@Req() req: Request) {
    const user = req.user;
    try {
      const userInfo = await this.authService.returnUser(user['email']);
      return userInfo.signedUp;

    } catch(err) {
      console.log('the user is not available');
      return false;
    }
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
      maxAge: oneDay,
      httpOnly: true, // for security
      secure: true,
    });
    res.cookie(
      'refresh_token',
      tokens.refresh_token,
      {
        maxAge: oneWeek,
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
      maxAge: oneDay,
      httpOnly: true, // for security
      secure: true,
    });
    res.cookie(
      'refresh_token',
      tokens.refresh_token,
      {
        maxAge: oneWeek,
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
      maxAge: oneDay,
      httpOnly: true, // for security
      secure: true,
    });
    res.cookie(
      'refresh_token',
      tokens.refresh_token,
      {
        maxAge: oneWeek,
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
    res.redirect(
      `http://${process.env.VITE_ADDRESS}:5173/signup`,
    );
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
  @ApiBody({
    description: 'An email in the body is required'
  })
  @ApiResponse({
    status: 201,
    description: 'The qrcode is returned and should be scanned to be verified in 2fa/verify request.'
  })
  @HttpCode(HttpStatus.CREATED)
  async enable2fa(
    @Body() body: TwoFaAuthDto,
    @Req() req: Request,
  ) {
    const user: Users =
      await this.authService.returnUser(
        req.user['email']
    );
    return this.authService.enable2fa(body, user);
  }

  @Post('2fa/verify')
  @ApiBody({
    description: 'A code as a string type is required in the body'
  })
  @ApiResponse({
    status: 200,
    description: 'The 2fa is enabled, the qrcode is returned and should be scanned to be verified.'
  })
  @HttpCode(HttpStatus.OK)
  async verify2fa(
    @Body() body: TwoFaCodeDto,
    @Req() req: Request,
  ) {
    const user: Users =
      await this.authService.returnUser(
        req.user['email'],
      );
    const state = await this.authService.verify2fa(body, user);
    if ( state ) {
      await this.authService.isEnable2fa(user);
      return true;
    }
    else {
      return false;
    }
    throw new UnauthorizedException(
      'code is wrong, try again',
    );
  }

  @Get('2fa/disable')
  @HttpCode(HttpStatus.OK)
  async disable2fa(@Req() req: Request) {
    console.log('11111111111111111')

    const user: Users =
      await this.authService.returnUser(
        req.user['email'],
      );
    console.log('222222222222222222',user.username)
    if (await this.authService.disable2fa(user))
      return 'Disabled successfuly';
    return "Error in disabling the 2fa"
    // throw new UnauthorizedException(
    //   'weird error',
    // );
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
    console.log('user info', tokens);
    res.cookie('token', tokens.access_token, {
      maxAge: oneDay,
      httpOnly: true, // for security
      secure: true,
    });
    res.cookie(
      'refresh_token',
      tokens.refresh_token,
      {
        maxAge: oneWeek,
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
    res.redirect(
      `http://${process.env.VITE_ADDRESS}:5173/signup`,
    );
  }
}