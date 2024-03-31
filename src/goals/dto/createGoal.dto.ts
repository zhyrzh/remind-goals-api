import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GoalChecklistDTO } from './goalChecklist.dto';

export class CreateGoalDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({
    always: true,
    each: true,
  })
  @ArrayMinSize(1, {
    message: 'Checklist must be at least 1',
  })
  @Type(() => GoalChecklistDTO)
  checklist: GoalChecklistDTO[];
}
