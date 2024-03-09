import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDTO } from './dto/createGoal.dto';
import { EditGoalDTO } from './dto/editGoaTitlel.dto';

@Controller('goals')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post('/')
  async addGoal(@Body() createBody: CreateGoalDTO) {
    return await this.goalsService.addGoal(createBody);
  }

  @Put('/:id')
  async editGoal(@Param('id') id: string, @Body() editBody: EditGoalDTO) {
    return this.goalsService.editGoalTitle(id, editBody);
  }
}
