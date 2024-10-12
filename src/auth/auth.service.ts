import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = { username: user.email, sub: user.email };

    return {
      access_token: this.jwtService.sign(payload),
      profile: user.userId,
    };
  }

  async findOne(username: string) {
    try {
      return await this.prismaService.userCredentials.findUnique({
        where: {
          email: username,
        },
        include: {
          user: true,
        },
      });
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

  async findOneFacebookId(id: string) {
    try {
      return await this.prismaService.userCredentials.findUnique({
        where: {
          facebookId: id,
        },
        include: {
          user: true,
        },
      });
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

  async validateUser(username: string, pass: string): Promise<any> {
    try {
      const { password, ...user } = await this.findOne(username);

      if (!user || password !== pass) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return user;
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

  async registerUser(body: RegisterUserDTO) {
    try {
      const { password, ...user } = await this.findOne(body.email);

      if (user) {
        throw new NotAcceptableException('User already exists');
      }
      const createdUser = await this.prismaService.userCredentials.create({
        data: {
          ...body,
          userId: body.email,
        },
      });

      const payload = { username: createdUser.email, sub: createdUser.email };

      return {
        access_token: this.jwtService.sign(payload),
        profile: user,
      };
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
