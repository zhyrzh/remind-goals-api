/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGoalDTO } from './dto/createGoal.dto';
import { EditGoalDTO } from './dto/editGoaTitlel.dto';

@Injectable()
export class GoalsService {
  constructor(private prismaService: PrismaService) {}

  async addGoal(body: CreateGoalDTO, user: string) {
    try {
      return await this.prismaService.goal.create({
        data: {
          title: body.title,
          checklist: {
            connect: body.checklist.map((itm) => ({ id: itm.id })),
          },
          userId: user,
        },
        include: {
          checklist: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        { reason: `Something went wrong when querying: ${error}` },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async editGoalTitle(id: string, { title }: EditGoalDTO) {
    try {
      return await this.prismaService.goal.update({
        where: {
          id: +id,
        },
        data: {
          title,
        },
      });
    } catch (error) {
      throw new HttpException(
        { reason: `Something went wrong when querying: ${error.meta.details}` },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllGoals(count: string, offset: string, title: string) {
    try {
      return await this.prismaService.goal.findMany({
        include: {
          checklist: true,
        },
        take: count ? +count : 10,
        skip: offset ? +offset : 0,
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        { reason: `Something went wrong when querying: ${error.meta.details}` },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteSpecificGoal(id: string) {
    try {
      return this.prismaService.goal.delete({
        where: {
          id: +id,
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
    } finally {
      await this.prismaService.$disconnect();
    }
  }

  async getSpecificGoal(id: string) {
    try {
      const foundGoal = await this.prismaService.goal.findUnique({
        where: {
          id: +id,
        },
        include: {
          checklist: true,
        },
      });

      if (foundGoal === null) {
        throw new HttpException(`Goal not found!`, HttpStatus.NOT_FOUND, {
          cause: new Error('No goal present on current database'),
        });
      }

      return foundGoal;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
