import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class FacebookLoginAuthGuard extends AuthGuard('facebook-login') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const parentCanActivate = (await super.canActivate(context)) as boolean;
    return parentCanActivate;
  }
}
