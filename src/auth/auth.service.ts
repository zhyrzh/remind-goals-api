import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { UserCredentials as IUserCredentials } from '@prisma/client';

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

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Omit<IUserCredentials, 'password'>> | null {
    try {
      const user = await this.findOne(username);

      if (user === null) {
        return null;
      }

      const { password, ...otherDetails } = user;

      const isPasswordValid = await bcrypt.compare(pass, password);

      if (!isPasswordValid) {
        return null;
      }

      return otherDetails;
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

      if (user !== null) {
        return new NotAcceptableException('User already exists');
      }

      const saltRnds = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(body.password, saltRnds);

      const createdUser = await this.prismaService.userCredentials.create({
        data: {
          password: hashedPassword,
          email: body.email,
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
