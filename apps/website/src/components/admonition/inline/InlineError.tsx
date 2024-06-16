import { type ColorProps } from "@chakra-ui/react";
import React from "react";
import { IoMdAlert } from "react-icons/io";

import { InlineAdmonitionWrapper } from "./InlineAdmonitionWrapper";
import { type InlineAdmonitionWrapperProps } from "./inlineAdmonition.types";

export interface InlineErrorProps {
  appendText?: InlineAdmonitionWrapperProps["appendText"];
  label: InlineAdmonitionWrapperProps["label"];
}
export function InlineError(props: InlineErrorProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "red.500";
  return (
    <InlineAdmonitionWrapper
      appendText={props.appendText}
      icon={IoMdAlert}
      iconBackgroundColor={color}
      label={props.label}
      labelColor={color}
    ></InlineAdmonitionWrapper>
  );
}
