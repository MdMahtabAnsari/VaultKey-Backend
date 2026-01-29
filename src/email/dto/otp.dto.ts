import { User } from 'better-auth';
export class EmailOTPDto {
  email: string;
  otp: string;
}

export class UserOTPDto {
  user: User;
  otp: string;
}
