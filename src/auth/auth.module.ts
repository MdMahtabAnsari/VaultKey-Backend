import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { nestAuth } from './configs/nest-auth';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../email/queue.service';

@Module({
  imports: [
    BetterAuthModule.forRootAsync({
      imports: [PrismaModule, EmailModule],
      inject: [PrismaService, QueueService],
      useFactory: (prisma: PrismaService, emailQueue: QueueService) => ({
        auth: nestAuth(prisma, emailQueue),
        middleware: (req, _res, next) => {
          req.url = req.originalUrl;
          req.baseUrl = '';
          next();
        },
      }),
    }),
  ],
  exports: [BetterAuthModule],
})
export class AuthModule {}
