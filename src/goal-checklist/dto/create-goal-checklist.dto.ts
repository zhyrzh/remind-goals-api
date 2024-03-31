import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateGoalChecklistDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
