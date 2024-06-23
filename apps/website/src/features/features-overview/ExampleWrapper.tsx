import { Box, type BoxProps, Center } from "@chakra-ui/react";
import React from "react";

interface ExampleWrapperProps extends BoxProps {
  children: React.ReactNode;
}

export function ExampleWrapper(props: ExampleWrapperProps): JSX.Element {
  const { children, ...boxProps } = props;
  return (
    <>
      <Center>
        <Box mt={5} {...boxProps}>
          {children}
        </Box>
      </Center>
    </>
  );
}
