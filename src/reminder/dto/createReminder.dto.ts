import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export enum FrequencyEnum {
  once = 'once',
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
  annually = 'annually',
}

export class CreateReminderDTO {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  @IsNotEmpty()
  triggerDate: Date;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsEnum(FrequencyEnum, {
    message: 'Invalid frequency value',
  })
  @IsNotEmpty()
  frequency: FrequencyEnum;
}
