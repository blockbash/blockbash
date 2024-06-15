import { type ColorProps } from "@chakra-ui/react";
import React from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";

import { AdmonitionWrapper } from "./AdmonitionWrapper";
import { type AdmonitionProps } from "./admonition.types";

export function Success(props: AdmonitionProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "green.500";
  return (
    <AdmonitionWrapper
      icon={IoMdCheckmarkCircle}
      iconBackgroundColor={color}
      label={"Success"}
      labelColor={color}
    >
      {props.children}
    </AdmonitionWrapper>
  );
}
