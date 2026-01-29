import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './queue.service';
import { ProcessorService } from './processor.service';
import { ConfigModule } from '@nestjs/config';
import { ResendModule } from 'nestjs-resend';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.registerQueue({
      name: 'email',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST!,
        port: Number(process.env.SMTP_PORT!),
        ignoreTLS: true,
        secure: false,
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!,
        },
        logger: true,
        debug: true,
      },
      defaults: {
        from: `"CBT Backend" <noreply@example.com>`,
      },
    }),
    ResendModule.forRootAsync({
      useFactory: () => ({
        apiKey: process.env.RESEND_API_KEY!,
      }),
    }),
  ],
  providers: [EmailService, QueueService, ProcessorService],
  exports: [QueueService],
})
export class EmailModule {}
