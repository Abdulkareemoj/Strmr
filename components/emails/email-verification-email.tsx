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

interface EmailVerificationProps {
  username?: string;
  verificationLink?: string;
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

export const EmailVerificationEmail = ({
  username = "user",
  verificationLink = "http://localhost:3000/verify-email",
}: EmailVerificationProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Verify Your Email</Heading>
        <Text style={text}>Hello {username},</Text>
        <Text style={text}>
          Thanks for signing up! Please verify your email address by clicking
          the button below.
        </Text>
        <Button style={button} href={verificationLink}>
          Verify Email
        </Button>
        <Text style={text}>
          If you did not sign up for an account, you can safely ignore this
          email.
        </Text>
      </Container>
    </Body>
  </Html>
);
