import { User } from 'better-auth';
import * as React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Link,
  Tailwind,
} from '@react-email/components';

interface WelcomeEmailProps {
  user: User;
}

export default function WelcomeEmail({ user }: WelcomeEmailProps) {
  const brand = 'VaultKey';
  const year = new Date().getFullYear();
  const appUrl = 'https://educart.example.com/dashboard';
  const displayName = user?.name;

  return (
    <Html>
      <Head />
      <Preview>Welcome to {brand}! 🎉</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-6 font-sans">
          <Container className="mx-auto w-full max-w-[600px] rounded-lg border border-[#eaeaea] bg-white p-8">
            <Section>
              <Heading className="m-0 mb-4 text-2xl font-bold leading-[1.3] text-gray-900">
                Welcome to {brand} 🎉
              </Heading>

              <Text className="m-0 mb-4 text-sm leading-relaxed text-gray-700">
                Hi {displayName}, we’re excited to have you on board. Your
                account is all set!
              </Text>

              <Text className="m-0 mb-4 text-sm leading-relaxed text-gray-700">
                Get started by exploring your dashboard, managing your courses,
                and personalizing your profile.
              </Text>

              <Section className="my-6 text-center">
                <Button
                  href={appUrl}
                  className="inline-block rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white no-underline"
                >
                  Get started
                </Button>
              </Section>

              <Text className="m-0 mb-4 text-sm leading-relaxed text-gray-700">
                Need help? Visit our{' '}
                <Link
                  href="https://educart.example.com/help"
                  className="text-[13px] text-blue-600 underline"
                >
                  Help Center
                </Link>{' '}
                or email us at{' '}
                <Link
                  href="mailto:support@educart.example.com"
                  className="text-[13px] text-blue-600 underline"
                >
                  support@educart.example.com
                </Link>
                .
              </Text>

              <Hr className="my-6 border-gray-200" />

              <Text className="m-0 mb-1 text-xs text-gray-500">
                You’re receiving this email because you created an account on{' '}
                {brand}.
              </Text>
              <Text className="m-0 text-xs text-gray-400">
                © {year} {brand}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
