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
    };
  }

  async findOne(username: string) {
    try {
      return await this.prismaService.userCredentials.findUnique({
        where: {
          email: username,
        },
        include: {
          user: false,
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
      const user = await this.findOne(username);

      if (!user || user.password !== pass) {
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
      const user = await this.findOne(body.email);

      if (user) {
        throw new NotAcceptableException('User already exists');
      }
      const createdUser = await this.prismaService.userCredentials.create({
        data: body,
      });

      const payload = { username: createdUser.email, sub: createdUser.email };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
