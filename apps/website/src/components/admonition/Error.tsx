import { type ColorProps } from "@chakra-ui/react";
import React from "react";
import { BsLightningFill } from "react-icons/bs";

import { AdmonitionWrapper } from "./AdmonitionWrapper";
import { type AdmonitionProps } from "./admonition.types";

export function Error({
  children,
  isCentered = false,
  isFlattened = true,
}: AdmonitionProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "red.500";
  return (
    <AdmonitionWrapper
      icon={BsLightningFill}
      iconBackgroundColor={color}
      isCentered={isCentered}
      isFlattened={isFlattened}
      label={"Error"}
      labelColor={color}
    >
      {children}
    </AdmonitionWrapper>
  );
}
