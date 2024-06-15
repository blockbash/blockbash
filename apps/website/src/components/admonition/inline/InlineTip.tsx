import { type ColorProps } from "@chakra-ui/react";
import React from "react";
import { FaRegLightbulb } from "react-icons/fa";

import { InlineAdmonitionWrapper } from "./InlineAdmonitionWrapper";
import { type InlineAdmonitionWrapperProps } from "./inlineAdmonition.types";

export interface InlineTipProps {
  appendText?: InlineAdmonitionWrapperProps["appendText"];
  label: InlineAdmonitionWrapperProps["label"];
}
export function InlineTip(props: InlineTipProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "green.500";
  return (
    <InlineAdmonitionWrapper
      appendText={props.appendText}
      icon={FaRegLightbulb}
      iconBackgroundColor={color}
      label={props.label}
      labelColor={color}
    ></InlineAdmonitionWrapper>
  );
}