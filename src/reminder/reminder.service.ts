import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReminderDTO } from './dto/createReminder.dto';
import { EditReminderDetailsDTO } from './dto/editReminderDetails.dto';

@Injectable()
export class ReminderService {
  constructor(private prismaService: PrismaService) {}

  async createReminder(user: string, body: CreateReminderDTO) {
    try {
      return await this.prismaService.reminder.create({
        data: {
          ...body,
          userId: user,
        },
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

  async deleteSpecificReminder(id: number) {
    try {
      return await this.prismaService.reminder.delete({
        where: {
          id,
        },
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

  async editReminderDetails(body: EditReminderDetailsDTO, id: number) {
    try {
      return await this.prismaService.reminder.update({
        where: {
          id,
        },
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

  async toggleIsActive(id: number, isActive: boolean) {
    try {
      return await this.prismaService.reminder.update({
        where: {
          id,
        },
        data: {
          isActive,
        },
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
}
