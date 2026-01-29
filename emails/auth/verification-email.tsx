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

interface VerificationEmailProps {
  user: User;
  url: string;
}

export default function VerificationEmail({
  user,
  url,
}: VerificationEmailProps) {
  const brand = 'VaultKey';
  const year = new Date().getFullYear();
  const displayName = user?.name;

  return (
    <Html>
      <Head />
      <Preview>Verify your email for {brand}</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-6 font-sans">
          <Container className="mx-auto w-full max-w-[600px] rounded-lg border border-[#eaeaea] bg-white p-8">
            <Section>
              <Heading className="m-0 mb-4 text-2xl font-bold leading-[1.3] text-gray-900">
                Verify your email
              </Heading>

              <Text className="m-0 mb-4 text-sm leading-relaxed text-gray-700">
                Hi {displayName}, thanks for signing up for {brand}. Please
                confirm your email address to get started.
              </Text>

              <Section className="my-6 text-center">
                <Button
                  href={url}
                  className="inline-block rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline"
                >
                  Verify email
                </Button>
              </Section>

              <Text className="m-0 mb-4 text-sm leading-relaxed text-gray-700">
                This link will expire soon for your security. If the button
                doesn’t work, copy and paste this URL into your browser:
              </Text>

              <Link href={url} className="text-[13px] text-blue-600 break-all">
                {url}
              </Link>

              <Hr className="my-6 border-gray-200" />

              <Text className="m-0 mb-1 text-xs text-gray-500">
                If you didn’t request this, you can safely ignore this email.
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
