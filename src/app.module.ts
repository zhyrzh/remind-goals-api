import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GoalsModule } from './goals/goals.module';
import { PrismaService } from './prisma/prisma.service';
import { GoalsService } from './goals/goals.service';

@Module({
  imports: [PrismaModule, GoalsModule],
  providers: [PrismaService, GoalsService],
})
export class AppModule {}
