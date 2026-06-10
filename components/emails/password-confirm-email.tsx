import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "react-email";
import * as React from "react";

interface PasswordConfirmEmailProps {
  username?: string;
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

export const PasswordConfirmEmail = ({
  username = "user",
}: PasswordConfirmEmailProps) => (
  <Html>
    <Head />
    <Preview>Your password has been changed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Password Changed</Heading>
        <Text style={text}>Hello {username},</Text>
        <Text style={text}>
          This email is to confirm that your password has been successfully
          changed.
        </Text>
        <Text style={text}>
          If you did not make this change, please contact our support team
          immediately.
        </Text>
      </Container>
    </Body>
  </Html>
);
