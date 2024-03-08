import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGoalDTO } from './dto/createGoal.dto';

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
      console.error(error);
      throw new HttpException(
        { reason: `Something went wrong when querying: ${error}` },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
