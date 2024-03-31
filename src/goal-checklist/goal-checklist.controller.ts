import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GoalChecklistService } from './goal-checklist.service';
import { CreateGoalChecklistDTO } from './dto/create-goal-checklist.dto';
import { User } from '../auth/decorators/user.decorator';

@Controller('goal-checklist')
export class GoalChecklistController {
  constructor(private goalChecklistService: GoalChecklistService) {}

  @Post('/')
  async addGoalChecklist(
    @Body() body: CreateGoalChecklistDTO,
    @User() useremail: string,
  ) {
    return await this.goalChecklistService.addGoalChecklist(body, useremail);
  }

  @Post('/to-existing-goal/:goalId')
  async addChecklistToExistingGoal(
    @Body() body: CreateGoalChecklistDTO,
    @Param('goalId') goalId: string,
    @User() useremail: string,
  ) {
    return await this.goalChecklistService.addChecklistToExistingGoal(
      body,
      goalId,
      useremail,
    );
  }

  @Put('/toggle-is-active/:id/:isActive')
  async toggleIsActive(@Param() params: { id: string; isActive: string }) {
    return await this.goalChecklistService.toggleIsActive(
      params.id,
      params.isActive,
    );
  }

  @Put('/edit-title/:id/:title')
  async editTitle(@Param() params: { id: string; title: string }) {
    return await this.goalChecklistService.editTitle(params.id, params.title);
  }

  @Delete('/:id')
  async deleteGoalChecklistItem(@Param('id') id: string) {
    return this.goalChecklistService.deleteGoalChecklistItem(id);
  }

  @Get('/get-all-no-goal-id')
  async getAllByUser(@User() user: string) {
    return this.goalChecklistService.getAllNoGoalId(user);
  }

  @Delete('/all/no-goal-id')
  async deleteAllNoGoalId(@User() user: string) {
    return this.goalChecklistService.deleteAllNoGoalId(user);
  }
}
