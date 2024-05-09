import {
  type BackgroundProps,
  Box,
  Icon as ChakraIcon,
  Flex,
  Text,
  chakra, ColorProps,
} from "@chakra-ui/react"
import { Styles } from "@src/css";
import React, { type ReactNode } from "react";
import { type IconType } from "react-icons";

export interface AdmonitionWrapperProps {
  admonitionLabel: string;
  content: ReactNode;
  icon: IconType;
  iconBackgroundColor: NonNullable<BackgroundProps["bg"]>;
  admonitionLabelColor: NonNullable<ColorProps["color"]>;
}

export function AdmonitionWrapper(props: AdmonitionWrapperProps): JSX.Element {
  const Content = props.content;
  const Icon = props.icon;
  return (
    <Flex alignItems="center" justifyContent="center" p={25} w="full">
      <Flex
        bg="white"
        border="1px"
        borderColor={Styles.borderColorMin}
        maxW="2xl"
        overflow="hidden"
        rounded="lg"
        shadow="lg"
      >
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
            <chakra.span color={props.admonitionLabelColor} fontSize={["xl"]} fontWeight="bold">
              {props.admonitionLabel}
            </chakra.span>
            <Text my={0} color="gray.600" fontSize="md" mt={1}>
              {Content}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
