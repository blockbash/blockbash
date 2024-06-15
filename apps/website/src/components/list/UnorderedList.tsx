import { UnorderedList as ChakraUnorderedList } from "@chakra-ui/react";
import React from "react";

import { type ListProps, baseListProps } from "./list.const";

/* See commentary in Root.tsx for why this exists */
export function UnorderedList(props: ListProps): JSX.Element {
  return (
    <ChakraUnorderedList {...baseListProps} {...props}>
      {props.children}
    </ChakraUnorderedList>
  );
}
