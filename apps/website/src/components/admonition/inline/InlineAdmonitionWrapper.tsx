import { Box, Icon as ChakraIcon, Flex, chakra } from "@chakra-ui/react";
import React from "react";

import { type InlineAdmonitionWrapperProps } from "./inlineAdmonition.types";

export function InlineAdmonitionWrapper(
  props: InlineAdmonitionWrapperProps,
): JSX.Element {
  const Icon = props.icon;

  return (
    <Box
      display={"inline-flex"}
      m={0.5}
      maxW={"fit-content"}
      position={"relative"}
      top={1}
    >
      <Flex
        bg="white"
        border="1px"
        borderColor="blackAlpha.700"
        overflow="hidden"
        rounded="lg"
      >
        {/* Icon */}
        <Flex
          alignItems="center"
          bg={props.iconBackgroundColor}
          justifyContent="center"
          w={5}
        >
          <ChakraIcon as={Icon} boxSize={4} color="white" />
        </Flex>

        <Flex mx={1}>
          <chakra.span
            alignContent={"center"}
            color={props.labelColor}
            fontSize={"md"}
            fontWeight="bold"
          >
            {props.label}
          </chakra.span>
          {typeof props.appendText !== "undefined" && (
            <chakra.span alignContent={"center"} fontSize={"md"} ml={1}>
              {props.appendText}
            </chakra.span>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
