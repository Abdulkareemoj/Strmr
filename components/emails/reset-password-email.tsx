import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "react-email";
import * as React from "react";

interface ResetPasswordEmailProps {
  username?: string;
  resetLink?: string;
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const heading = {
  fontSize: "28px",
  fontWeight: "bold",
  marginTop: "48px",
};

const text = {
  margin: "0 0 40px 0",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

export const ResetPasswordEmail = ({
  username = "user",
  resetLink = "http://localhost:3000/reset-password",
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Reset Your Password</Heading>
        <Text style={text}>Hello {username},</Text>
        <Text style={text}>
          Someone recently requested a password change for your account. If this
          was you, you can set a new password here:
        </Text>
        <Button style={button} href={resetLink}>
          Reset Password
        </Button>
        <Text style={text}>
          If you don&apos;t want to change your password or didn&apos;t request
          this, just ignore and delete this message.
        </Text>
      </Container>
    </Body>
  </Html>
);
