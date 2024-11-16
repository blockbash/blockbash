import { type ColorProps } from "@chakra-ui/react";
import React from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";

import { AdmonitionWrapper } from "./AdmonitionWrapper";
import { type AdmonitionProps } from "./admonition.types";

export function Success({
  children,
  isCentered = false,
  isFlattened = true,
  labelOverride,
}: AdmonitionProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "green.500";
  return (
    <AdmonitionWrapper
      icon={IoMdCheckmarkCircle}
      iconBackgroundColor={color}
      isCentered={isCentered}
      isFlattened={isFlattened}
      label={typeof labelOverride === "undefined" ? "Success" : labelOverride}
      labelColor={color}
    >
      {children}
    </AdmonitionWrapper>
  );
}
