import { User } from 'better-auth';
export class EmailUrlDto {
  email: string;
  url: string;
}

export class UserUrlDto {
  user: User;
  url: string;
}

export class UserUrlEmailDto {
  user: User;
  email: string;
  url: string;
}
