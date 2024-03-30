import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { SetupProfileDTO } from './dto/setupProfile.dto';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/setup-profile')
  async setupProfile(@Body() body: SetupProfileDTO, @User() userEmail: string) {
    return await this.usersService.setupProfile(body, userEmail);
  }
}
