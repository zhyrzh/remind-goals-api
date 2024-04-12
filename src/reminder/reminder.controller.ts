import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDTO } from './dto/createReminder.dto';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('reminder')
export class ReminderController {
  constructor(private reminderService: ReminderService) {}

  @Post('/')
  async createReminder(@Body() body: CreateReminderDTO) {
    return await this.reminderService.createReminder(body);
  }

  @Get('/')
  async getAllReminders(
    @Query('count') count: string,
    @Query('offset') offset: string,
    @Query('content') content: string,
    @User() user: string,
  ) {
    return await this.reminderService.getAllReminder(
      {
        content,
        offset,
        count,
      },
      user,
    );
  }

  @Delete('/:id')
  async deleteSpecificReminder(@Param('id', ParseIntPipe) id: number) {
    return await this.reminderService.deleteSpecificReminder(id);
  }
}
