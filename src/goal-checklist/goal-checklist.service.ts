import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGoalChecklistDTO } from './dto/create-goal-checklist.dto';

@Injectable()
export class GoalChecklistService {
  constructor(private prismaService: PrismaService) {}

  async addGoalChecklist(body: CreateGoalChecklistDTO) {
    try {
      return await this.prismaService.goalChecklist.create({
        data: body,
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

  async toggleIsActive(checklistItemId: string, isActive: string) {
    try {
      return await this.prismaService.goalChecklist.update({
        where: {
          id: +checklistItemId,
        },
        data: {
          isActive: JSON.parse(isActive),
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

  async editTitle(checklistItemId: string, title: string) {
    try {
      return await this.prismaService.goalChecklist.update({
        where: {
          id: +checklistItemId,
        },
        data: {
          title,
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

  async deleteGoalChecklistItem(id: string) {
    try {
      return await this.prismaService.goalChecklist.delete({
        where: {
          id: +id,
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
