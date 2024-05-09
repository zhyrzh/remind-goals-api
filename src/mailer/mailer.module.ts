import { Module } from '@nestjs/common';
import { MailerModule as Mailer } from '@nestjs-modules/mailer';

@Module({
  imports: [
    Mailer.forRoot({
      transport: {
        service: process.env.MAILER_SERVICE,
        host: process.env.MAILER_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        },
      },
    }),
  ],
})
export class MailerModule {}
