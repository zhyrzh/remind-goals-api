import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetupProfileDTO } from './dto/setupProfile.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async setupProfile(data: SetupProfileDTO, user: string) {
    try {
      return this.prismaService.user.create({
        data: {
          ...data,
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
