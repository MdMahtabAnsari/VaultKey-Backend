import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface InvitationEmailProps {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}

export const InvitationEmail = ({
  email = 'user@example.com',
  invitedByUsername = 'John Doe',
  invitedByEmail = 'john@example.com',
  teamName = 'Acme Organization',
  inviteLink = 'https://example.com/invite/token',
}: InvitationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>You've been invited to join {teamName} on VaultKey</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto bg-white my-16 rounded-lg shadow-sm">
            <Section className="px-12 py-8">
              <Heading className="text-3xl font-bold text-gray-900 mb-6">
                Join {teamName} on VaultKey
              </Heading>
              <Text className="text-base text-gray-700 mb-4">Hi {email},</Text>
              <Text className="text-base text-gray-700 mb-4">
                <strong>{invitedByUsername}</strong> ({invitedByEmail}) has
                invited you to join <strong>{teamName}</strong> on VaultKey.
              </Text>
              <Button
                className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg mt-6 mb-6 block text-center no-underline"
                href={inviteLink}
              >
                Accept Invitation
              </Button>
              <Text className="text-base text-gray-700 mb-2">
                Or copy and paste this URL into your browser:
              </Text>
              <Link
                href={inviteLink}
                className="text-blue-500 text-sm underline break-all"
              >
                {inviteLink}
              </Link>
              <Text className="text-sm text-gray-500 mt-8">
                If you weren't expecting this invitation, you can ignore this
                email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InvitationEmail;
