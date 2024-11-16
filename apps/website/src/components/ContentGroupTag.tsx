import { Tag as ChakraTag, type TagProps } from "@chakra-ui/react";
import React from "react";

export function ContentGroupTag(props: TagProps) {
  const { children } = props;
  return (
    <ChakraTag
      boxShadow="lg"
      minWidth="fit-content"
      rounded="xl"
      variant="subtle"
      {...props}
    >
      {children}
    </ChakraTag>
  );
}
