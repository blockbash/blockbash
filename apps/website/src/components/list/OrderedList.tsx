import { OrderedList as ChakraOrderedList } from "@chakra-ui/react";
import React from "react";

import { type ListProps, baseListProps } from "./list.const";

/* See commentary in Root.tsx for why this exists */
export function OrderedList(props: ListProps): JSX.Element {
  return (
    <ChakraOrderedList {...baseListProps} {...props}>
      {props.children}
    </ChakraOrderedList>
  );
}
