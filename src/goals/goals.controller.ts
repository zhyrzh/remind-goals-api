import { Body, Controller, Post } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDTO } from './dto/createGoal.dto';

@Controller('goals')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post('/')
  async addGoal(@Body() body: CreateGoalDTO) {
    return await this.goalsService.addGoal(body);
  }
}
