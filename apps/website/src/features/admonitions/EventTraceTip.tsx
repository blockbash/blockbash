import { chakra } from "@chakra-ui/react";
import { Tip } from "@components";
import React from "react";

export function EventTraceTip(): JSX.Element {
  return (
    <Tip>
      <chakra.span>
        This event trace was generated from the 'Code' section (above).
      </chakra.span>
    </Tip>
  );
}
