import { type ColorProps } from "@chakra-ui/react";
import React from "react";
import { FaRegLightbulb } from "react-icons/fa";

import { AdmonitionWrapper } from "./AdmonitionWrapper";
import { type AdmonitionProps } from "./admonition.types";

export function Tip({
  children,
  isCentered = true,
  isFlattened = true,
  labelOverride,
}: AdmonitionProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "green.500";
  return (
    <AdmonitionWrapper
      icon={FaRegLightbulb}
      iconBackgroundColor={color}
      isCentered={isCentered}
      isFlattened={isFlattened}
      label={typeof labelOverride === "undefined" ? "Tip" : labelOverride}
      labelColor={color}
    >
      {children}
    </AdmonitionWrapper>
  );
}
