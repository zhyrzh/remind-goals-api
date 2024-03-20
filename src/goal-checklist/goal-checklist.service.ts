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
}
