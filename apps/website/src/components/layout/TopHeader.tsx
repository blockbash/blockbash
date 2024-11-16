import { Box, Heading, Image } from "@chakra-ui/react";
import BlockbashImageUrl from "@site/static/img/blockbash.png";
import React from "react";

interface TopHeaderProps {
  children?: React.ReactNode;
  title: string;
}

export function TopHeader({ children, title }: TopHeaderProps): JSX.Element {
  return (
    <Box textAlign="center">
      <Image boxSize={250} src={BlockbashImageUrl} />
      <Heading as="h1" fontWeight="bold" size="2xl">
        {title}
      </Heading>
      {children}
    </Box>
  );
}
