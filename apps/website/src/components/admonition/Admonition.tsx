import {
  type BackgroundProps,
  Box,
  Icon as ChakraIcon,
  Flex,
  chakra,
} from "@chakra-ui/react";
import { Span } from "@components";
import { Styles } from "@src/css";
import React, { type ReactNode } from "react";
import { type IconType } from "react-icons";

export interface AdmonitionProps {
  admonitionLabel: string;
  content: ReactNode;
  icon: IconType;
  iconBackgroundColor: BackgroundProps["bg"];
}

export function Admonition(props: AdmonitionProps): JSX.Element {
  const Content = props.content;
  const Icon = props.icon;
  return (
    <Flex alignItems="center" justifyContent="center" p={25} w="full">
      <Flex
        bg="white"
        border="1px"
        borderColor={Styles.borderColorMin}
        maxW="2xl"
        mx="auto"
        overflow="hidden"
        rounded="lg"
        shadow="lg"
        w="full"
      >
        <Flex
          alignItems="center"
          bg={props.iconBackgroundColor}
          justifyContent="center"
          w={7}
        >
          <ChakraIcon
            as={Icon}
            border={"10px"}
            borderColor={"black"}
            boxSize={6}
            color="white"
          />
        </Flex>

        <Box py={2}>
          <Box mx={3}>
            <chakra.span fontSize={"xl"} fontWeight="bold">
              <Span>{props.admonitionLabel}</Span>
            </chakra.span>
            <chakra.p color="gray.600" fontSize="md" mt={1}>
              {Content}
            </chakra.p>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}
