import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

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
  @Type(() => GoalChecklist)
  checklist: GoalChecklist[];
}

class GoalChecklist {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
