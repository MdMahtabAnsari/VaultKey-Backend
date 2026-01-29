import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../../prisma/prisma.service';
import { QueueService } from '../../email/queue.service';
import {
  twoFactor,
  username,
  magicLink,
  admin as adminPlugin,
  lastLoginMethod,
  openAPI,
  multiSession,
  emailOTP,
  deviceAuthorization,
  organization,
  jwt,
  bearer,
} from 'better-auth/plugins';
import { passkey } from '@better-auth/passkey';
import { username as usernameSchema } from './common';
import { admin, user, ac as adminAc } from './permissions/admin.permission';
import { expo } from '@better-auth/expo';
import {
  ac as organizationAc,
  admin as orgAdmin,
  memeber,
  owner,
} from './permissions/organization.permission';

export const nestAuth = (prisma: PrismaService, emailQueue: QueueService) => {
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),
    user: {
      changeEmail: {
        enabled: true,
        sendChangeEmailVerification: async ({ user, newEmail, url }) => {
          await emailQueue.changeEmail({ user, url, email: newEmail });
        },
      },
    },
    emailAndPassword: {
      requireEmailVerification: true,
      enabled: true,
      sendResetPassword: async ({ user, url }) => {
        await emailQueue.resetPassword({ user, url });
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        await emailQueue.verificationEmail({ user, url });
      },
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      afterEmailVerification: async (user) => {
        await emailQueue.welcomeEmail({ user });
      },
    },
    account: {
      accountLinking: {
        enabled: true,
      },
    },
    plugins: [
      bearer(),
      expo(),
      jwt(),
      organization({
        requireEmailVerificationOnInvitation: true,
        async sendInvitationEmail(data) {
          const inviteLink = `${process.env.BETTER_AUTH_URL}/api/organization/accept-invitation/${data.invitation.id}`;
          await emailQueue.organizationInvitation({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            teamName: data.organization.name,
            inviteLink,
          });
        },
        allowUserToCreateOrganization(user) {
          return user.role === 'admin';
        },
        ac: organizationAc,
        roles: {
          admin: orgAdmin,
          member: memeber,
          owner: owner,
        },
        dynamicAccessControl: {
          enabled: true,
        },
        teams: {
          enabled: true,
        },
      }),
      deviceAuthorization({
        verificationUri: '/device',
      }),
      emailOTP({
        async sendVerificationOTP({ email, otp, type }) {
          if (type === 'sign-in') {
            await emailQueue.signInOTP({ email, otp });
          } else if (type === 'email-verification') {
            await emailQueue.emailVerificationOTP({ email, otp });
          } else {
            await emailQueue.resetPasswordOTP({ email, otp });
          }
        },
      }),
      multiSession(),
      twoFactor({
        issuer: 'vaultkey',
        otpOptions: {
          sendOTP: async ({ user, otp }) => {
            await emailQueue.OTPEmail({ user, otp });
          },
        },
      }),
      username({
        usernameValidator: (username) => {
          return usernameSchema.safeParse(username).success;
        },
      }),
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await emailQueue.magicLink({ email, url });
        },
      }),
      passkey(),
      adminPlugin({
        defaultRole: 'user',
        ac: adminAc,
        roles: {
          admin,
          user,
        },
      }),
      lastLoginMethod(),
      openAPI(),
    ],
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60, //seconds
      },
    },
    secret: process.env.BETTER_AUTH_SECRET!,
    trustedOrigins: process.env.TRUSTED_CLIENT_URL!.split(','),
    url: process.env.BETTER_AUTH_URL!,
  });
};
