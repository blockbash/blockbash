import { Box, type BoxProps, Text } from "@chakra-ui/react";
import { LinkComponent } from "@components";
import { Styles } from "@src/css";
import React from "react";

import { type LinkComponentProps } from "../link/LinkComponent";

interface QuoteProps extends BoxProps {
  author: string;
  children: React.ReactElement;
  href: LinkComponentProps["href"];
  link?: string;
}

export function Quote(props: QuoteProps): JSX.Element {
  return (
    <Box
      bg="white"
      border={"1px"}
      borderColor={Styles.borderColorMin}
      borderRadius="lg"
      boxShadow="lg"
      maxW="lg"
      mx="auto"
      my={4}
      p={4}
    >
      <Box as={"blockquote"}>
        <Text fontSize="xl" fontStyle="italic" my={4} textAlign="center">
          {props.children}
        </Text>
      </Box>
      <LinkComponent href={props.href} shouldOpenTab={true}>
        <Text fontWeight="bold" textAlign="right">
          — {props.author}
        </Text>
      </LinkComponent>
    </Box>
  );
}

export default Quote;
