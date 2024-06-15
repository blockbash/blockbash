import { type ColorProps } from "@chakra-ui/react";
import React from "react";
import { BsLightningFill } from "react-icons/bs";

import { AdmonitionWrapper } from "./AdmonitionWrapper";
import { type AdmonitionProps } from "./admonition.types";

export function Error(props: AdmonitionProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "red.500";
  return (
    <AdmonitionWrapper
      icon={BsLightningFill}
      iconBackgroundColor={color}
      label={"Error"}
      labelColor={color}
    >
      {props.children}
    </AdmonitionWrapper>
  );
}
