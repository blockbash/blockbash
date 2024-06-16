import { type ColorProps } from "@chakra-ui/react";
import React from "react";
import { FaRegLightbulb } from "react-icons/fa";

import { AdmonitionWrapper } from "./AdmonitionWrapper";
import { type AdmonitionProps } from "./admonition.types";

export function Tip(props: AdmonitionProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "green.500";
  return (
    <AdmonitionWrapper
      icon={FaRegLightbulb}
      iconBackgroundColor={color}
      label={"Tip"}
      labelColor={color}
    >
      {props.children}
    </AdmonitionWrapper>
  );
}
