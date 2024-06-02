import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReminderDTO } from './dto/createReminder.dto';
import { EditReminderDetailsDTO } from './dto/editReminderDetails.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { Reminder } from '@prisma/client';

@Injectable()
export class ReminderService {
  constructor(
    private prismaService: PrismaService,
    private mailerService: MailerService,
  ) {}

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

  @Cron(CronExpression.EVERY_10_SECONDS)
  async sendNotification() {
    try {
      const usersWithRemindersToday: { user: string; reminders: Reminder[] }[] =
        [];

      // get all reminders that needs to be delivered today
      const reminders = await this.prismaService.reminder.findMany({
        where: {
          AND: [
            {
              reminderStartDate: {
                gte: new Date(
                  `${dayjs().format('YYYY-MM-DD').toString()} 00:00:00`,
                ),
              },
            },
            {
              reminderStartDate: {
                lte: new Date(
                  `${dayjs().format('YYYY-MM-DD').toString()} 23:59:59`,
                ),
              },
            },
          ],
        },
      });

      // Arranged each item by user
      for (let i = 0; i <= reminders.length - 1; i++) {
        if (
          usersWithRemindersToday.filter(
            (itm) => itm.user === reminders[i].userId,
          ).length === 0
        ) {
          usersWithRemindersToday.push({
            user: reminders[i].userId,
            reminders: [{ ...reminders[i] }],
          });
        } else {
          usersWithRemindersToday.map((itm) =>
            itm.user === reminders[i].userId
              ? { ...itm, reminders: itm.reminders.push({ ...reminders[i] }) }
              : itm,
          );
        }
      }

      usersWithRemindersToday.forEach(async (itm) => {
        await this.mailerService.sendMail({
          to: itm.user,
          from: '"RemindGoals App" <remindgoals@gmail.com>', // override default from
          subject: 'You have reminders to be addressed today',
          html: `You have ${itm.reminders.length} that needs your attention`,
        });
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
