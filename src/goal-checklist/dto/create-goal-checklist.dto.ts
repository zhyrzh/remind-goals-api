import { IsBoolean, IsString } from 'class-validator';

export class CreateGoalChecklistDTO {
  @IsString()
  title: string;

  @IsBoolean()
  isActive: boolean;
}
