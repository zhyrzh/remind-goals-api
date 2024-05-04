import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GoalsModule } from './goals/goals.module';
import { PrismaService } from './prisma/prisma.service';
import { GoalsService } from './goals/goals.service';
import { GoalChecklistModule } from './goal-checklist/goal-checklist.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { ReminderModule } from './reminder/reminder.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    PrismaModule,
    GoalsModule,
    GoalChecklistModule,
    AuthModule,
    UsersModule,
    ReminderModule,
    MailerModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    PrismaService,
    GoalsService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
