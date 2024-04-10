import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReminderDTO } from './dto/createReminder.dto';

@Injectable()
export class ReminderService {
  constructor(private prismaService: PrismaService) {}

  async createReminder(body: CreateReminderDTO) {
    try {
      return await this.prismaService.reminder.create({
        data: body,
      });
    } catch (error) {
      throw new HttpException(
        {
          reason: `Something went wrong when querying: ${
            error.meta.details ? error.meta.details : error
          }`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllReminder(
    params: {
      count: string;
      offset: string;
      content: string;
    },
    user: string,
  ) {
    try {
      return await this.prismaService.reminder.findMany({
        take: params.count ? +params.count : 10,
        skip: params.offset ? +params.offset : 0,
        where: {
          content: {
            contains: params.content,
            mode: 'insensitive',
          },
          userId: user,
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
