import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
interface VercelInviteUserEmailProps {
  username?: string;
  invitedByUsername?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
  role?: string;
}

export const AroraInviteUserEmail = ({
  username,
  invitedByUsername,
  teamName,
  teamImage,
  inviteLink,
  role,
}: VercelInviteUserEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={teamImage}
                width="40"
                height="37"
                alt="Vercel"
                className="my-0 mx-auto rounded-full"
              />
            </Section>
            <Text className="text-black text-[24px] font-normal  text-center p-0 my-[30px] mx-0">
              Join <strong className="capitalize">{username}</strong> on{" "}
              <strong>{teamName}</strong>
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello <span className=" font-bold capitalize">{username}</span>,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong className=" capitalize">{invitedByUsername}</strong> has
              invited you to Join his agency <strong>{teamName} as </strong>{" "}
              <strong>{role}</strong>.
            </Text>
            <Section>
              <Row>
                <Column align="right">
                  <Img
                    className="rounded-full"
                    src={
                      "https://utfs.io/f/fc1d0da7-d3b3-4206-8318-c22236039afa-yk1nqd.png"
                    }
                    width="64"
                    height="64"
                  />
                </Column>
                <Column align="center">
                  <Img
                    src={`https://utfs.io/f/99a50d4e-d2fe-4fc5-963f-fb8acf97c21b-1jf9c9.png`}
                    width="45"
                    height="45"
                    alt="invited you to"
                  />
                </Column>
                <Column align="left">
                  <Img
                    className="rounded-full bg-black"
                    src={teamImage}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Login on our website using Google
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

AroraInviteUserEmail.PreviewProps = {
  username: "alanturing",
  userImage: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUVUH27sngAnS6SnsRdfbuX7XISzFxw-ZVVVgpUWkTBA&s`,
  invitedByUsername: "Alan",
  teamName: "Enigma",
  teamImage: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRa7UsXyOFCYt-DyoB8KyeFgyejTWZnrgkPn4i1kiARQ&s`,
  inviteLink: "https://vercel.com/teams/invite/foo",
} as VercelInviteUserEmailProps;

export default AroraInviteUserEmail;
