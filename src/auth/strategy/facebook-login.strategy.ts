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
      clientID: '948452230274802',
      clientSecret: '53db37ba90999420d8b7244dec2393a4',
      callbackURL: `http://localhost:5000/auth/facebook/login/redirect`,
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
      console.log('login strat');
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

  error(err: any): void {
    console.log(err, 'check error');
  }
}
