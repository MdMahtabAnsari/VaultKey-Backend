import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
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

export const auth = betterAuth({
  database: prismaAdapter(
    {},
    {
      provider: 'postgresql',
    },
  ),
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async () => {},
    },
  },
  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,
    sendResetPassword: async () => {},
  },
  emailVerification: {
    sendVerificationEmail: async () => {},
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    afterEmailVerification: async () => {},
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
      async sendVerificationOTP() {},
    }),
    multiSession(),
    twoFactor({
      issuer: 'vaultkey',
      otpOptions: {
        sendOTP: async () => {},
      },
    }),
    username({
      usernameValidator: (username) => {
        return usernameSchema.safeParse(username).success;
      },
    }),
    magicLink({
      sendMagicLink: async () => {},
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
    ...(process.env.NODE_ENV !== 'production' ? [openAPI()] : []),
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
