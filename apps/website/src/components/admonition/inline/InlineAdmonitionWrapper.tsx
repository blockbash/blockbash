import { Box, Icon as ChakraIcon, Flex, chakra } from "@chakra-ui/react";
import { Styles } from "@src/css";
import React from "react";

import { sharedInlineStyles } from "../../global-styles.const";
import { type InlineAdmonitionWrapperProps } from "./inlineAdmonition.types";

export function InlineAdmonitionWrapper(
  props: InlineAdmonitionWrapperProps,
): JSX.Element {
  const Icon = props.icon;

  return (
    <Box
      display={"inline-block"}
      maxW={"fit-content"}
      position={"relative"}
      top={0.5}
    >
      <Flex
        bg="white"
        border="1px"
        borderColor={Styles.borderColorMed}
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
          <ChakraIcon as={Icon} boxSize={3.5} color="white" />
        </Flex>

        <Flex {...sharedInlineStyles} mx={1} px={0.5}>
          <chakra.span color={props.labelColor} fontWeight="bold">
            {props.label}
          </chakra.span>
        </Flex>
      </Flex>
    </Box>
  );
}
