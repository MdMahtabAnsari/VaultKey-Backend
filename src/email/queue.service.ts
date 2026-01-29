import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { User } from 'better-auth';
import { EmailOTPDto, UserOTPDto } from './dto/otp.dto';
import { EmailUrlDto, UserUrlDto, UserUrlEmailDto } from './dto/url.dto';
import { OrganizationInvitationDto } from './dto/invitation.dto';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}
  async changeEmail({ user, url, email }: UserUrlEmailDto) {
    await this.emailQueue.add(
      'change-email',
      { user, url, email },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }

  async resetPassword({ user, url }: UserUrlDto) {
    await this.emailQueue.add(
      'reset-password',
      { user, url },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
  async verificationEmail({ user, url }: UserUrlDto) {
    await this.emailQueue.add(
      'verification-email',
      { user, url },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
  async welcomeEmail({ user }: { user: User }) {
    await this.emailQueue.add(
      'welcome-email',
      { user },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
  async signInOTP({ email, otp }: EmailOTPDto) {
    await this.emailQueue.add(
      'sign-in-otp',
      { email, otp },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
  async resetPasswordOTP({ email, otp }: EmailOTPDto) {
    await this.emailQueue.add(
      'reset-password-otp',
      { email, otp },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
  async emailVerificationOTP({ email, otp }: EmailOTPDto) {
    await this.emailQueue.add(
      'email-verification-otp',
      { email, otp },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
  async OTPEmail({ user, otp }: UserOTPDto) {
    await this.emailQueue.add(
      'otp-email',
      { user, otp },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
  async magicLink({ email, url }: EmailUrlDto) {
    await this.emailQueue.add(
      'magic-link',
      { email, url },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }

  async organizationInvitation(data: OrganizationInvitationDto) {
    await this.emailQueue.add('organization-invitation', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
}
