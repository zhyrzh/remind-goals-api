import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FacebookSignupStrategy extends PassportStrategy(
  Strategy,
  'facebook-signup',
) {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_LOGIN_CB_URL,
      scope: 'email',
      profileFields: ['emails', 'first_name', 'gender', 'last_name', 'picture'],
      passReqToCallback: true,
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
      const { emails, id: facebookId } = profile;

      const foundUser = await this.authService.findOne(emails[0].value);
      if (foundUser) {
        return done(null, {
          message:
            'Facebook user already registered! Login using facebook to proceed.',
        });
      }

      const registeredUser = await this.prismaService.userCredentials.create({
        data: {
          email: emails[0].value,
          facebookId,
          user: {
            create: {
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              id: emails[0].value,
            },
          },
        },
      });

      const payload = {
        username: registeredUser.email,
        sub: registeredUser.email,
      };

      const access_token = this.jwtService.sign(payload);

      return done(null, { access_token });
    } catch (error) {
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
