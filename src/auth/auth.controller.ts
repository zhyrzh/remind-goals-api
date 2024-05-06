import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';

import { FacebookLoginAuthGuard } from './guards/facebook-login.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Request() req: Request) {
    return this.authService.login(req['user']);
  }

  @Public()
  @Post('/register')
  async registerUser(@Body() body: RegisterUserDTO) {
    return await this.authService.registerUser(body);
  }

  @Public()
  @Get('/login/facebook')
  @UseGuards(FacebookLoginAuthGuard)
  async facebookLogin() {
    return HttpStatus.OK;
  }
}
