import { IsNotEmpty, IsString } from 'class-validator';

export class EditGoalDTO {
  @IsNotEmpty()
  @IsString()
  title: string;
}
