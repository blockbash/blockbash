import { type ColorProps } from "@chakra-ui/react";
import React from "react";
import { IoMdAlert } from "react-icons/io";

import { AdmonitionWrapper } from "./AdmonitionWrapper";
import { type AdmonitionProps } from "./admonition.types";

export function Info(props: AdmonitionProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "blue.500";
  return (
    <AdmonitionWrapper
      icon={IoMdAlert}
      iconBackgroundColor={color}
      label={"Info"}
      labelColor={color}
    >
      {props.children}
    </AdmonitionWrapper>
  );
}
