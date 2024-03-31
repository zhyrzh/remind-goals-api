import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDTO } from './dto/createGoal.dto';
import { EditGoalDTO } from './dto/editGoaTitlel.dto';
import { User } from '../auth/decorators/user.decorator';

@Controller('goals')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post('/')
  async addGoal(@Body() createBody: CreateGoalDTO, @User() user: string) {
    return await this.goalsService.addGoal(createBody, user);
  }

  @Put('/:id')
  async editGoal(@Param('id') id: string, @Body() editBody: EditGoalDTO) {
    return await this.goalsService.editGoalTitle(id, editBody);
  }

  @Get('/')
  async getAllGoals(
    @Query('count') count: string,
    @Query('offset') offset: string,
    @Query('title') title: string,
  ) {
    return await this.goalsService.getAllGoals({ count, offset, title });
  }

  @Delete('/:id')
  async deleteSpecificGoal(@Param('id') id: string) {
    return await this.goalsService.deleteSpecificGoal(id);
  }

  @Get('/specific/:id')
  async getSpecificGoal(@Param('id') id: string) {
    return await this.goalsService.getSpecificGoal(id);
  }
}
