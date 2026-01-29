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

interface MagicLinkEmailProps {
  url: string;
}

export default function MagicLinkEmail({ url }: MagicLinkEmailProps) {
  const brand = 'VaultKey';
  const year = new Date().getFullYear();

  return (
    <Html>
      <Head />
      <Preview>Sign in to {brand} with your magic link</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-6 font-sans">
          <Container className="mx-auto w-full max-w-[600px] rounded-lg border border-[#eaeaea] bg-white p-8">
            <Section>
              <Heading className="m-0 mb-4 text-2xl font-bold leading-[1.3] text-gray-900">
                Your magic sign-in link
              </Heading>

              <Text className="m-0 mb-4 text-sm leading-relaxed text-gray-700">
                Hi there, click the button below to securely sign in to {brand}.
              </Text>

              <Section className="my-6 text-center">
                <Button
                  href={url}
                  className="inline-block rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline"
                >
                  Sign in
                </Button>
              </Section>

              <Text className="m-0 mb-4 text-sm leading-relaxed text-gray-700">
                This link will expire soon. If the button doesn’t work, copy and
                paste this URL into your browser:
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
