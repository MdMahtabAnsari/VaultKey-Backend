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
  Hr,
  Tailwind,
} from '@react-email/components';
import { OTPEmailProps } from './sign-in-otp-email';

export default function ResetPasswordOTPEmail({ email, otp }: OTPEmailProps) {
  const brand = 'EduCart';
  const year = new Date().getFullYear();
  const safeOTP = String(otp ?? '').replace(/\s+/g, '');
  const displayEmail = email || 'there';

  return (
    <Html>
      <Head />
      <Preview>Your {brand} verification code</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-6 font-sans">
          <Container className="mx-auto w-full max-w-[600px] rounded-lg border border-[#eaeaea] bg-white p-8">
            <Section>
              <Heading className="m-0 mb-4 text-2xl font-bold leading-[1.3] text-gray-900">
                Your verification code
              </Heading>

              <Text className="m-0 mb-4 text-sm leading-relaxed text-gray-700">
                Hi {displayEmail}, use the code below to complete your password
                reset.
              </Text>

              <Section
                className="flex justify-center gap-2 mt-5 mb-2"
                aria-label="One-time passcode"
              >
                {safeOTP.split('').map((d, i) => (
                  <span
                    key={i}
                    className="inline-block min-w-[42px] px-2.5 py-3 text-center text-[22px] font-bold font-mono text-gray-900 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    {d}
                  </span>
                ))}
              </Section>

              <Text className="m-0 mt-1 mb-4 text-center text-[12px] text-gray-500">
                Code:{' '}
                <span className="font-mono font-bold text-gray-900">
                  {safeOTP}
                </span>
              </Text>

              <Text className="m-0 mb-2 text-center text-[12px] text-gray-500">
                For your security, this code will expire soon and can only be
                used once.
              </Text>

              <Hr className="my-6 border-gray-200" />

              <Text className="m-0 mb-1 text-[12px] text-gray-500">
                If you didn’t request this, you can safely ignore this email.
              </Text>
              <Text className="m-0 text-[12px] text-gray-400">
                © {year} {brand}. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
