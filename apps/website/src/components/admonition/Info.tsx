import { type ColorProps } from "@chakra-ui/react";
import React from "react";
import { IoMdAlert } from "react-icons/io";

import { AdmonitionWrapper } from "./AdmonitionWrapper";
import { type AdmonitionProps } from "./admonition.types";

export function Info({
  children,
  isCentered = false,
  isFlattened = true,
  labelOverride,
}: AdmonitionProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "blue.500";
  return (
    <AdmonitionWrapper
      icon={IoMdAlert}
      iconBackgroundColor={color}
      isCentered={isCentered}
      isFlattened={isFlattened}
      label={typeof labelOverride === "undefined" ? "Info" : labelOverride}
      labelColor={color}
    >
      {children}
    </AdmonitionWrapper>
  );
}
