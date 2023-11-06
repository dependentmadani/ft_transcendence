import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Users } from '@prisma/client';



@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly config: ConfigService) { //need to be update into private readonly AuthService
    super({
      clientID: config.get('CLIENT_ID'), // Replace with your 42 app client ID
      clientSecret: config.get('CLIENT_SECRET'), // Replace with your 42 app client secret
      callbackURL: 'http://localhost:8000/auth/42/callback',
});
  }

  async validate (accessToken: string, refreshToken: string, profile: any)
  {
    // //console.log('profile:', profile)
    const user = {
      id: profile._json.id,
      avatar: profile._json.image.link,
      username: profile._json.login,
      email: profile._json.email,
      // friend: [],
      // block: [],
    };

    return {
      users: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
