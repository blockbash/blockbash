import {
  Divider as ChakraDivider,
  type DividerProps as ChakraDividerProps,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { Styles } from "@src/css";
import React from "react";

interface DividerProps extends ChakraDividerProps {
  title?: string;
}

function Divider(props: DividerProps): JSX.Element {
  const { title } = props;
  if (typeof title !== "undefined") {
    return (
      <Flex>
        <ChakraDivider borderColor={Styles.borderColorMin} {...props} />
        <Heading as="h3" minW="fit-content" mt={3} px={3} size="sm">
          {title}
        </Heading>
        <ChakraDivider borderColor={Styles.borderColorMin} />
      </Flex>
    );
  }
  return (
    <ChakraDivider
      borderColor={Styles.borderColorMin}
      my={0}
      variant="dashed"
      {...props}
    />
  );
}

export { Divider };
