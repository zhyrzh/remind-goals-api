import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = { username: user.email, sub: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
