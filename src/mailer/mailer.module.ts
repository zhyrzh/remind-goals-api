import { Module } from '@nestjs/common';
import { MailerModule as Mailer } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as path from 'path';

@Module({
  imports: [
    Mailer.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        },
      },
      template: {
        adapter: new EjsAdapter(),
      },
      options: {
        partials: {
          dir: path.join(process.env.PWD, 'templates/partials'),
          options: {
            strict: true,
          },
        },
      },
    }),
  ],
})
export class MailerModule {}
