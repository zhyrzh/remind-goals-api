import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetupProfileDTO } from './dto/setupProfile.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async setupProfile(profileData: SetupProfileDTO, user: string) {
    try {
      const data = await this.prismaService.userCredentials.update({
        where: {
          email: user,
        },
        data: {
          user: {
            connectOrCreate: {
              where: {
                id: user,
              },
              create: {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                id: user,
              },
            },
          },
        },
      });
      return data;
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

  async getUserInfo(user: string) {
    try {
      return this.prismaService.user.findUnique({
        where: {
          id: user,
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
}
