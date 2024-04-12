import { Body, Controller, Post } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDTO } from './dto/createReminder.dto';

@Controller('reminder')
export class ReminderController {
  constructor(private reminderService: ReminderService) {}

  @Post('/')
  async createReminder(@Body() body: CreateReminderDTO) {
    return await this.reminderService.createReminder(body);
  }
}
