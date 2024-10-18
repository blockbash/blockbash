import { Box, Icon as ChakraIcon, Flex, Text, chakra } from "@chakra-ui/react";
import { Styles } from "@src/css";
import React from "react";

import { Divider } from "../Divider";
import { type InlineAdmonitionWrapperProps } from "./inline/inlineAdmonition.types";

export interface AdmonitionWrapperProps extends InlineAdmonitionWrapperProps {
  children: React.ReactElement;
  isCentered: boolean;
  isFlattened: boolean;
}

export function AdmonitionWrapper({
  children,
  icon: Icon,
  iconBackgroundColor,
  isCentered,
  isFlattened,
  label,
  labelColor,
}: AdmonitionWrapperProps): JSX.Element {
  return (
    <Flex maxW={"lg"} mx={isCentered ? "auto" : 0}>
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
          bg={iconBackgroundColor}
          justifyContent="center"
          w={7}
        >
          <ChakraIcon as={Icon} boxSize={5} color="white" />
        </Flex>

        <Box py={isFlattened ? 1 : 2}>
          <Box mx={3}>
            <chakra.span
              color={labelColor}
              display={isFlattened ? "inline" : "block"}
              fontWeight="bold"
            >
              {label}
              {isFlattened && ":"}{" "}
            </chakra.span>
            {!isFlattened && (
              <Box my={1}>
                <Divider />
              </Box>
            )}
            <Text display={isFlattened ? "inline" : "block"} my={0}>
              {children}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
