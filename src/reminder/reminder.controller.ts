import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { CreateReminderDTO } from './dto/createReminder.dto';
import { EditReminderDetailsDTO } from './dto/editReminderDetails.dto';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('reminder')
export class ReminderController {
  constructor(private reminderService: ReminderService) {}

  @Post('/')
  async createReminder(@User() user: string, @Body() body: CreateReminderDTO) {
    return await this.reminderService.createReminder(user, body);
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

  @Put('/details/:id')
  async editReminderDetails(
    @Body() body: EditReminderDetailsDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.reminderService.editReminderDetails(body, id);
  }

  @Put('/:id/:isActive')
  async toggleIsActive(
    @Param('id', ParseIntPipe) id: number,
    @Param('isActive', ParseBoolPipe) isActive: boolean,
  ) {
    return await this.reminderService.toggleIsActive(id, isActive);
  }
}
