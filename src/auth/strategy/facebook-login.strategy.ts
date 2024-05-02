import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FacebookLoginStrategy extends PassportStrategy(
  Strategy,
  'facebook-login',
) {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_LOGIN_CB_URL,
      scope: 'email',
      profileFields: ['emails', 'first_name', 'gender', 'last_name', 'picture'],
      passReqToCallback: true,
      passResToCallback: true,
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    try {
      const { id } = profile;

      const foundUser = await this.authService.findOneFacebookId(id);
      if (!foundUser) {
        return done(null, { message: 'Facebook user not yet registered!' });
      }

      const payload = {
        username: foundUser.email,
        sub: foundUser.email,
      };

      const access_token = this.jwtService.sign(payload);

      return done(null, { access_token, profile: foundUser.user });
    } catch (error) {
      //   console.log(error, 'check errror');
      throw new HttpException(
        {
          reason: `Something went wrong when querying: ${
            error.meta?.details ? error.meta?.details : error
          }`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
