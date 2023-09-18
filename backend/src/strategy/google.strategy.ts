import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(
    private readonly config: ConfigService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get(
        'GOOGLE_CLIENT_SECRET',
      ),
      callbackURL: `http://${process.env.ADDRESS}:8000/auth/google_auth/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    const { name, emails, photos } = profile;
    // const user = {
    //   email: emails[0].value,
    //   firstName: name.givenName,
    //   lastName: name.familyName,
    //   picture: photos[0].value,
    //   accessToken
    // }
    const user = {
      id: name.id,
      avatar: photos[0].value,
      username: name.givenName + name.familyName,
      email: emails[0].value,
    };
    return {
      users: user,
      accessToken,
      refreshToken,
    };
  }
}
