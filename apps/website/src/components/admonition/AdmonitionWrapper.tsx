import { Box, Icon as ChakraIcon, Flex, Text, chakra } from "@chakra-ui/react";
import { Styles } from "@src/css";
import React, { type ReactNode } from "react";

import { Divider } from "../Divider";
import { type InlineAdmonitionWrapperProps } from "./inline/inlineAdmonition.types";

export interface AdmonitionWrapperProps extends InlineAdmonitionWrapperProps {
  children: ReactNode;
}

export function AdmonitionWrapper(props: AdmonitionWrapperProps): JSX.Element {
  const children = props.children;
  const Icon = props.icon;

  return (
    <Flex maxW={"lg"}>
      <Flex
        bg="white"
        border="1px"
        borderColor={Styles.borderColorMed}
        boxShadow="md"
        overflow="hidden"
        rounded="lg"
      >
        {/* Icon */}
        <Flex
          alignItems="center"
          bg={props.iconBackgroundColor}
          justifyContent="center"
          w={7}
        >
          <ChakraIcon as={Icon} boxSize={6} color="white" />
        </Flex>

        <Box py={2}>
          <Box mx={3}>
            <chakra.span
              color={props.labelColor}
              fontSize={["xl"]}
              fontWeight="bold"
            >
              {props.label}
            </chakra.span>
            <Box my={1}>
              <Divider />
            </Box>
            <Text color="gray.600" fontSize="md" my={0}>
              {children}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
