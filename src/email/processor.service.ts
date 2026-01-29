import { Processor, WorkerHost, OnQueueEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from './email.service';

@Processor('email')
export class ProcessorService extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case 'change-email':
        await this.emailService.changeEmail(job.data);
        break;

      case 'reset-password':
        await this.emailService.resetPassword(job.data);
        break;

      case 'verification-email':
        await this.emailService.verificationEmail(job.data);
        break;

      case 'welcome-email':
        await this.emailService.welcomeEmail(job.data);
        break;

      case 'sign-in-otp':
        await this.emailService.signInOTP(job.data);
        break;

      case 'reset-password-otp':
        await this.emailService.resetPasswordOTP(job.data);
        break;

      case 'email-verification-otp':
        await this.emailService.emailVerificationOTP(job.data);
        break;

      case 'otp-email':
        await this.emailService.OTPEmail(job.data);
        break;

      case 'magic-link':
        await this.emailService.magicLink(job.data);
        break;
      case 'organization-invitation':
        await this.emailService.organizationInvitation(job.data);
        break;

      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  @OnQueueEvent('completed')
  onCompleted(job: Job) {
    console.log(`✅ Job ${job.id} of type ${job.name} has been completed.`);
  }
  @OnQueueEvent('failed')
  onFailed(job: Job, error: Error) {
    console.error(
      `❌ Job ${job.id} of type ${job.name} has failed with error: ${error.message}`,
    );
  }
}
