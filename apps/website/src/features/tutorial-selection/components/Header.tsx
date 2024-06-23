import { Box, Heading, Image } from "@chakra-ui/react";
import BlockbashImageUrl from "@site/static/img/blockbash.png";
import React from "react";

export function Header(): JSX.Element {
  return (
    <Box textAlign="center">
      <Image boxSize={250} src={BlockbashImageUrl} />
      <Heading as="h1" fontWeight="bold" size="2xl">
        BlockBash
      </Heading>
      <Heading as="h1" fontWeight="light" size="xl" textTransform="capitalize">
        Where developers learn Blockchain security
      </Heading>
      <Heading as="h2" fontWeight="light" size="md" textTransform="capitalize">
        free. open source. hands-on.
      </Heading>
    </Box>
  );
}
