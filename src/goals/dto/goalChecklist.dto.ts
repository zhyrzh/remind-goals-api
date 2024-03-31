import { IsNotEmpty, IsNumber } from 'class-validator';

export class GoalChecklistDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
