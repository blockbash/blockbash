import { Styles } from "@src/css";
import React from "react";
import { IoMdAlert } from "react-icons/io";

import { InlineAdmonitionWrapper } from "./InlineAdmonitionWrapper";
import { type InlineAdmonitionWrapperProps } from "./inlineAdmonition.types";

export interface InlineWarningProps {
  appendText?: InlineAdmonitionWrapperProps["appendText"];
  label: InlineAdmonitionWrapperProps["label"];
}
export function InlineWarning(props: InlineWarningProps): JSX.Element {
  return (
    <InlineAdmonitionWrapper
      appendText={props.appendText}
      icon={IoMdAlert}
      iconBackgroundColor={Styles.yellowPrimaryColor}
      label={props.label}
      labelColor={"black"}
    ></InlineAdmonitionWrapper>
  );
}
