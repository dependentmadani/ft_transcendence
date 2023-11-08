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
  private aiUserCreated : boolean;
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    this.aiUserCreated = false;
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, 10);
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
            password: await this.hashData(dto.password),
            avatar: avatar,
            userStatus: "ONLINE"
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

  async signupGoogle(
    dto: AuthDto,
    avatar?: string,
  ): Promise<Tokens> {
    //need to hash the password for security reasons
    try {
      // console.log('nadi canadi', dto)
      try {
        if (this.aiUserCreated === false) {
          const user = await this.prisma.users.create({
            data: {
              username: 'akinator',
              email: 'ai@gmail.com',
              isActive: true,
              avatar: '/boot.jpg',
            }
          })
          await this.prisma.game.create({
            data: {
              userId: user.id,
            }
          });
          this.aiUserCreated = true;
        }
      } catch {
        console.log('bot already created');
      }
      const usernameTaken = await this.findUserByUsername(dto.username, dto.email);
      if (usernameTaken) {
        const users =
        await this.prisma.users.create({
          data: {
            email: dto.email,
            avatar: avatar,
            userStatus: "ONLINE"
          },
        });
        await this.prisma.game.create({
          data: {
            userId: users.id,
          }
        });
        const token = await this.signToken(
          users.id,
          users.email,
        );
        await this.updateRtHashed(
          users.id,
          token.refresh_token,
        );
        return token;
      }
      const users =
        await this.prisma.users.create({
          data: {
            username: dto.username,
            email: dto.email,
            avatar: avatar,
            userStatus: "ONLINE"
          },
        });
      await this.prisma.game.create({
          data: {
            userId: users.id,
          }
        });
        const token = await this.signToken(
          users.id,
          users.email,
        );
        await this.updateRtHashed(
          users.id,
          token.refresh_token,
        );
        return token;
      //the password need to be deleted so it cannot be reached by interder
      

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
          username: dto?.username
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
    await this.prisma.users.update({
      where: {
        id: user.id,
      },
       data: {
        userStatus: "ONLINE",
       }
    });

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
        userStatus: "OFFLINE",
        hashRt: null,
      },
    });
    // console.log(cookies);
  }

  async signup42(dto: AuthDto, profile?: any) {
    //need to hash the password for security reasons

    try {
      try {
        if (this.aiUserCreated === false) {
          const user = await this.prisma.users.create({
            data: {
              username: 'akinator',
              email: 'ai@gmail.com',
              isActive: true,
              avatar: '/boot.jpg',
            }
          })
          await this.prisma.game.create({
            data: {
              userId: user.id,
            }
          });
          this.aiUserCreated = true;
        }
      } catch {
        console.log('the bot is already created');
      }
      const usernameAvailable = await this.prisma.users.findUnique({
        where: {
          username: dto.username,
        }
      });
      if (usernameAvailable) {
        const users =
          await this.prisma.users.create({
            data: {
              email: dto.email,
              avatar: profile.avatar,
              userStatus: "ONLINE",
            },
          });
        await this.prisma.game.create({
            data: {
              userId: users.id,
            }
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
      }
      const users =
        await this.prisma.users.create({
          data: {
            username: dto.username,
            email: dto.email,
            avatar: profile.avatar,
            userStatus: "ONLINE",
          },
        });
      await this.prisma.game.create({
          data: {
            userId: users.id,
          }
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
    await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        userStatus: "ONLINE",
      }
    });
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
    const available = await this.findUserByEmail(
      userDto.username,
      userDto.email,
    );
    if (!available) {
      return await this.signupGoogle(
        userDto,
        userInfo['users'].avatar,
      );
    }
    const user =
      await this.prisma.users.findUnique({
        where: {
          email: userDto.email
        },
      });

    await this.prisma.users.update({
      where: {
        id: user.id,
      },
       data: {
        userStatus: "ONLINE",
       }
    });

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

  async fortyTwo(profile: any) {
    // console.log(profile);
    const userDto: AuthDto = {
      username: profile.username,
      email: profile.email,
    };
    const available = await this.findUserByEmail(
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

  async verifyToken(token: string) {
    return this.jwt.decode(token);
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
    if (verified)
      return true;

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
    // console.log(user);
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
        expiresIn: 1000 * 60 * 60 * 24,
      }),
      this.jwt.signAsync(payload, {
        secret: secretRt,
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async findUserByEmail(
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

  async findUserByUsername(
    username: string,
    email: string,
  ): Promise<boolean> {
    const user =
      await this.prisma.users.findUnique({
        where: {
          username: username,
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
        include: {
          friends: true,
          blocked: true,
        }
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