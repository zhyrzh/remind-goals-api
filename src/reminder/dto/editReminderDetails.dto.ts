import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { FrequencyEnum } from './createReminder.dto';

export class EditReminderDetailsDTO {
  @IsOptional()
  @IsString()
  content: string;

  @IsEnum(FrequencyEnum, {
    message: 'Invalid frequency value',
  })
  @IsOptional()
  frequency: FrequencyEnum;

  @IsDateString()
  @IsOptional()
  reminderStartDate: Date;
}
