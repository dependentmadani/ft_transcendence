import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import {
  AuthDto,
  TwoFaAuthDto,
  TwoFaCodeDto,
} from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types';
import { Users, userStatus } from '@prisma/client';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async signupLocal(
    dto: AuthDto,
    avatar?: string,
  ): Promise<Tokens> {
    //need to hash the password for security reasons

    try {
      const users =
        await this.prisma.users.create({
          data: {
            username: dto.username,
            email: dto.email,
            avatar: avatar,
          },
        });
      //the password need to be deleted so it cannot be reached by interder
      const token = await this.signToken(
        users.id,
        users.email,
      );
      await this.updateRtHashed(
        users.id,
        token.refresh_token,
      );

      return token;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          //P2002 means that there is duplicate error launched by prisma
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
    }
  }

  async signinLocal(
    dto: AuthDto,
  ): Promise<Tokens> {
    const user =
      await this.prisma.users.findUnique({
        where: {
          email: dto.email,
          username: dto?.username,
          password: dto?.password,
        },
      });

    //did not find the username
    if (!user)
      throw new ForbiddenException(
        'Access Denied',
      );
    if (dto.password) {
      const passwordChecker =
        await bcrypt.compare(
          dto.password,
          user.password,
        );
      if (!passwordChecker)
        throw new ForbiddenException(
          'Password wrong',
        );
    }

    const token = await this.signToken(
      user.id,
      user.email,
    );
    await this.updateRtHashed(
      user.id,
      token.refresh_token,
    );

    return token;
  }

  async logout(userId: number, cookies: any) {
    await this.prisma.users.updateMany({
      where: {
        id: userId,
        hashRt: {
          not: null,
        },
      },
      data: {
        hashRt: null,
      },
    });
    console.log(cookies);
  }

  async signup42(dto: AuthDto, profile?: any) {
    //need to hash the password for security reasons

    try {
      const users =
        await this.prisma.users.create({
          data: {
            username: dto.username,
            email: dto.email,
            avatar: profile.avatar,
          },
        });
      //the password need to be deleted so it cannot be reached by interder
      const token = await this.signToken(
        users.id,
        users.email,
      );
      await this.updateRtHashed(
        users.id,
        token.refresh_token,
      );

      return token;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          //P2002 means that there is duplicate error launched by prisma
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
    }
  }

  async signin42(dto: AuthDto) {
    const user =
      await this.prisma.users.findUnique({
        where: {
          email: dto.email,
        },
      });
    //did not find the username
    if (!user)
      throw new ForbiddenException(
        'Access Denied',
      );

    delete user.password;
    const token = await this.signToken(
      user.id,
      user.email,
    );
    await this.updateRtHashed(
      user.id,
      token.refresh_token,
    );

    return token;
  }

  async signinGoogle(req: Request) {
    const userInfo = req.user;
    if (!userInfo)
      throw new ForbiddenException(
        'user info not found',
      );
    const userDto: AuthDto = {
      username: userInfo['users'].username,
      email: userInfo['users'].email,
    };
    const available = await this.findUser(
      userDto.username,
      userDto.email,
    );
    if (!available) {
      return await this.signupLocal(
        userDto,
        userInfo['users'].avatar,
      );
    }
    return await this.signinLocal(userDto);
  }

  async fortyTwo(profile: any) {
    // console.log(profile);
    const userDto: AuthDto = {
      username: profile.username,
      email: profile.email,
    };
    const available = await this.findUser(
      profile.username,
      profile.email,
    );
    let token;
    if (!available) {
      token = await this.signup42(
        userDto,
        profile,
      );
      return [token, true];
    }
    token = await this.signin42(userDto);
    return [token, false];
  }

  async refreshTokens(
    userdId: number,
    rt: string,
  ): Promise<Tokens> {
    const user =
      await this.prisma.users.findUnique({
        where: {
          id: userdId,
        },
      });

    if (!user || !user.hashRt)
      throw new ForbiddenException(
        'Access Denied',
      );

    const rtCompare = await bcrypt.compare(
      rt,
      user.hashRt,
    );
    if (!rtCompare)
      throw new ForbiddenException(
        'Wrong creddentials',
      );

    const token = await this.signToken(
      user.id,
      user.email,
    );
    await this.updateRtHashed(
      user.id,
      token.refresh_token,
    );

    return token;
  }

  //generate qrcode for enabling 2fa
  async enable2fa(
    body: TwoFaAuthDto,
    user: Users,
  ): Promise<string> {
    const secret = speakeasy.generateSecret();

    await this.prisma.users.update({
      where: {
        id: user.id,
        email: user.email,
      },
      data: {
        twofaEmail: body.email,
        twofa: secret.base32,
      },
    });

    return await qrcode.toDataURL(
      secret.otpauth_url,
    );
  }

  async verify2fa(
    body: TwoFaCodeDto,
    user: Users,
  ): Promise<boolean> {
    const theUser =
      await this.prisma.users.findUnique({
        where: {
          id: user.id,
          email: user.email,
        },
      });
    const secret = theUser.twofa;
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: body.code,
    });
    if (verified) return true;
    //     throw new UnauthorizedException('code entered is wrong, please retry again!');

    return false;
  }

  async isEnable2fa(user: Users) {
    await this.prisma.users.update({
      where: {
        id: user.id,
        email: user.email,
      },
      data: {
        twoEnabled: true,
      },
    });
  }

  async disable2fa(
    user: Users,
  ): Promise<boolean> {
    const users = await this.prisma.users.update({
      where: {
        id: user.id,
        email: user.email,
      },
      data: {
        twoEnabled: false,
        twofaEmail: null,
        twofa: null,
      },
    });

    if (!users) return false;
    return true;
  }

  async updateUserState(
    userId: number,
    state: boolean,
    status: userStatus
  ) {
    const user: Users =
      await this.prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          isActive: state,
        },
      });
    console.log(user);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<Tokens> {
    const payload = {
      sub: userId,
      email,
    };

    const secretAt = this.config.get<string>(
      'JWT_SECRET_AT',
    );
    const secretRt = this.config.get<string>(
      'JWT_SECRET_RT',
    );

    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: secretAt,
        expiresIn: 60 * 15,
      }),
      this.jwt.signAsync(payload, {
        secret: secretRt,
        expiresIn: 60 * 60 * 24 * 7,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async findUser(
    username: string,
    email: string,
  ): Promise<boolean> {
    const user =
      await this.prisma.users.findUnique({
        where: {
          email: email,
        },
      });

    if (!user) {
      return false;
    }
    return true;
  }

  async returnUser(
    email: string,
  ): Promise<Users> {
    const user =
      await this.prisma.users.findUnique({
        where: {
          email: email,
        },
      });
    return user;
  }

  async updateRtHashed(
    userId: number,
    hashedRt: string,
  ) {
    const hash = await this.hashData(hashedRt);

    await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        hashRt: hash,
      },
    });
  }

  // async redirectToFortyTwo(dto: any, strategy: FortyTwoStrategy){
  //         // to authenticate the 42 user, get it from auth controller
  //         console.log(strategy);
  //         // strategy.validate()

  //     }
}
