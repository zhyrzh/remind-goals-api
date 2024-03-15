import { Module } from '@nestjs/common';
import { GoalChecklistController } from './goal-checklist.controller';
import { GoalChecklistService } from './goal-checklist.service';

@Module({
  controllers: [GoalChecklistController],
  providers: [GoalChecklistService],
})
export class GoalChecklistModule {}
