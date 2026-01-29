import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import ChangeEmailEmail from '../../emails/auth/change-email-email';
import ResetPasswordEmail from '../../emails/auth/reset-password-email';
import VerificationEmail from '../../emails/auth/verification-email';
import WelcomeEmail from '../../emails/auth/welcome-email';
import SignInOTPEmail from '../../emails/auth/otp/sign-in-otp-email';
import ResetPasswordOTPEmail from '../../emails/auth/otp/reset-password-otp-email';
import EmailVerificationOTPEmail from '../../emails/auth/otp/email-verification-otp-email';
import OTPEmail from '../../emails/auth/otp/otp-email';
import MagicLinkEmail from '../../emails/auth/magic-link-email';
import { render } from '@react-email/render';
import { User } from 'better-auth';
import { EmailOTPDto, UserOTPDto } from './dto/otp.dto';
import { EmailUrlDto, UserUrlDto, UserUrlEmailDto } from './dto/url.dto';
import { OrganizationInvitationDto } from './dto/invitation.dto';
import OrganizationInvitationEmail from '../../emails/auth/organization/invitation-email';
import { ResendService } from 'nestjs-resend';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly resendService: ResendService,
  ) {}
  private async sendMail(to: string, subject: string, template: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      html: template,
    });
  }
  async sendViaResend(to: string, subject: string, html: string) {
    await this.resendService.send({
      to,
      from: process.env.EMAIL_FROM!,
      subject,
      html,
    });
  }
  async changeEmail({ user, url, email }: UserUrlEmailDto) {
    await this.sendViaResend(
      email,
      'Change your email',
      await render(ChangeEmailEmail({ user, url, newEmail: email })),
    );
  }

  async resetPassword({ user, url }: UserUrlDto) {
    await this.sendViaResend(
      user.email,
      'Reset your password',
      await render(ResetPasswordEmail({ user, url })),
    );
  }
  async verificationEmail({ user, url }: UserUrlDto) {
    await this.sendViaResend(
      user.email,
      'Verify your email',
      await render(VerificationEmail({ user, url })),
    );
  }
  async welcomeEmail({ user }: { user: User }) {
    await this.sendViaResend(
      user.email,
      'Welcome to our service',
      await render(WelcomeEmail({ user })),
    );
  }
  async signInOTP({ email, otp }: EmailOTPDto) {
    await this.sendViaResend(
      email,
      'Your Sign-In OTP',
      await render(SignInOTPEmail({ email, otp })),
    );
  }
  async resetPasswordOTP({ email, otp }: EmailOTPDto) {
    await this.sendViaResend(
      email,
      'Your Reset Password OTP',
      await render(ResetPasswordOTPEmail({ email, otp })),
    );
  }
  async emailVerificationOTP({ email, otp }: EmailOTPDto) {
    await this.sendViaResend(
      email,
      'Your Email Verification OTP',
      await render(EmailVerificationOTPEmail({ email, otp })),
    );
  }
  async OTPEmail({ user, otp }: UserOTPDto) {
    await this.sendViaResend(
      user.email,
      'Your OTP',
      await render(OTPEmail({ user, otp })),
    );
  }
  async magicLink({ email, url }: EmailUrlDto) {
    await this.sendViaResend(
      email,
      'Your Magic Link',
      await render(MagicLinkEmail({ url })),
    );
  }
  async organizationInvitation(data: OrganizationInvitationDto) {
    await this.sendViaResend(
      data.email,
      `Invitation to join ${data.teamName} on VaultKey`,
      await render(OrganizationInvitationEmail(data)),
    );
  }
}
