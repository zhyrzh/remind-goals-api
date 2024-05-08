import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/registerUser.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';
import { Response } from 'express';
import { FacebookLoginAuthGuard } from './guards/facebook-login.guard';
import { FacebookSignupAuthGuard } from './guards/facebook-signup.guard';

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

  @Public()
  @Get('/facebook/login/redirect')
  @UseGuards(FacebookLoginAuthGuard)
  async facebookLoginRedirect(
    @Req() req: Request,
    @Res() response: Response,
  ): Promise<any> {
    response.cookie('my-key', req['user']);
    return response.redirect('http://localhost:3000/login');
  }

  @Public()
  @UseGuards(FacebookSignupAuthGuard)
  @Get('/signup/facebook')
  async facebookSignup() {
    return HttpStatus.OK;
  }

  @Public()
  @UseGuards(FacebookSignupAuthGuard)
  @Get('/facebook/signup/redirect')
  async facebookSignupRedirect(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    response.cookie('my-key', req['user']);
    return response.redirect('http://localhost:3000/login');
  }
}
