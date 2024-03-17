/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGoalDTO } from './dto/createGoal.dto';
import { EditGoalDTO } from './dto/editGoaTitlel.dto';

@Injectable()
export class GoalsService {
  constructor(private prismaService: PrismaService) {}

  async addGoal(body: CreateGoalDTO) {
    try {
      return await this.prismaService.goal.create({
        data: {
          title: body.title,
          checklist: {
            createMany: {
              data: body.checklist,
            },
          },
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
}
